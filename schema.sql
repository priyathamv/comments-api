DROP TABLE IF EXISTS Comments;

CREATE TABLE Comments
  (Id	INTEGER PRIMARY KEY AUTOINCREMENT,
    ApplicationId INTEGER NOT NULL,
    BlogId INTEGER NOT NULL,
    Comment TEXT NOT NULL,
    UserName TEXT,
    Email TEXT,
    IsVerified	INTEGER CHECK (IsVerified IN (0, 1)) DEFAULT 0,
    ParentId INTEGER,
    IsAnonymous INTEGER CHECK (IsAnonymous IN (0, 1)) DEFAULT 1,
    Votes INTEGER DEFAULT 0,
    CreatedOn	DATETIME,
    UpdatedOn DATETIME
  );

-- CREATE TRIGGER comments_update_trigger
-- AFTER UPDATE ON Comments
-- FOR EACH ROW
-- BEGIN
--   UPDATE Comments SET UpdatedOn = CURRENT_TIMESTAMP WHERE ID = OLD.ID;
-- END;

CREATE INDEX idx_comments_application_blog ON Comments (ApplicationId, BlogId);
