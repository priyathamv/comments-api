const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': '*'
}

export default {
  async fetch(request, env, context) {
    if (request.method === 'OPTIONS')
      return new Response('OK', { headers: corsHeaders });

    const url = new URL(request.url);

    if (url.pathname === '/') {
      return handleRootRequest();
    }

    if (url.pathname === '/api/v1/comments/save') {
      return handleSaveCommentRequest(request, env);
    }

    if (url.pathname === '/api/v1/comments') {
      return handleGetCommentsRequest(request, env);
    }

    return new Response(
      JSON.stringify({ message: 'Invalid request' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
  }
}

// Handle requests to the root URL
async function handleRootRequest() {
  return new Response(
    JSON.stringify({status: 'Comments API service running!'}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
}

// Handle requests to the /api/v1/comments/save URL
async function handleSaveCommentRequest(request, env) {
  const requestBody = await request.json();
  const {
    applicationId,
    blogId,
    comment,
    userName,
    email,
    isVerified,
    parentId,
    isAnonymous
  } = requestBody;

  const createdOn = new Date().toISOString();
  const updatedOn = createdOn;

  console.log('damn', createdOn, updatedOn);

  try {
    const saveResponse  = await env.COMMENTS_DB
      .prepare('INSERT INTO Comments (ApplicationId, BlogId, Comment, UserName, Email, IsVerified, ParentId, IsAnonymous, CreatedOn, UpdatedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(applicationId, blogId, comment, userName, email, isVerified, parentId, isAnonymous, createdOn, updatedOn)
      .all();

    return new Response(
      JSON.stringify(saveResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
  } catch (error) {
    console.log('Exception while saving a comment', error);
    return new Response(
      JSON.stringify({ message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
  }
}

// Handle requests to the /api/v1/comments URL
async function handleGetCommentsRequest(request, env) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const applicationId = params.get('applicationId');
  const blogId = params.get('blogId');

  try {
    const commentsResponse = await env.COMMENTS_DB
      .prepare('SELECT * FROM Comments WHERE ApplicationId = ? AND BlogId = ?')
      .bind(applicationId, blogId)
      .all();

    return new Response(
      JSON.stringify(commentsResponse.results), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.log(`Exception while fetching comments for application ${applicationId} and blog ${blogId}`, error);
    return new Response(
      JSON.stringify({ message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
  }
}


