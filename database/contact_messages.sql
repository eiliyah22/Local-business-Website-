
USE maicookies;

CREATE TABLE IF NOT EXISTS contact_messages (
  message_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  topic      VARCHAR(50)  NOT NULL,
  message    TEXT         NOT NULL,
  sent_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
