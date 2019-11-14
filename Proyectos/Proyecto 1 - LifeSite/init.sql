CREATE TABLE user (
    email VARCHAR2(255) NOT NULL PRIMARY KEY,
    pass VARCHAR2(255) NOT NULL,
    username VARCHAR2(255) NOT NULL,
    gender VARCHAR2(255) NOT NULL,
    birth_date DATE,
    profile_img BLOB,
    puntuation INT DEFAULT 0
);

CREATE TABLE friend_requests(
    username_from VARCHAR2(255) NOT NULL,
    username_to VARCHAR2(255) NOT NULL,

    FOREIGN KEY (username_1,username_2) REFERENCES user(email),
    PRIMARY KEY (username_1,username_2)
)

CREATE TABLE friendships(
    username_1 VARCHAR2(255) NOT NULL,
    username_2 VARCHAR2(255) NOT NULL,

    FOREIGN KEY (username_1,username_2) REFERENCES user(email),
    PRIMARY KEY (username_1,username_2)
)

CREATE TABLE questions (
    id INT AUTO NOT NULL INCREMENT PRIMARY KEY,
    question_body VARCHAR(255) NOT NULL 
)

CREATE TABLE answers(
    id INT AUTO NOT NULL INCREMENT PRIMARY KEY,
    id_question NOT NULL,
    answer_body VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (id_question) REFERENCES questions(id),
)

CREATE TABLE user_answers (
    username VARCHAR2(255) NOT NULL,
    id_answer INT NOT NULL,

    FOREIGN KEY (username) REFERENCES user(email),
    FOREIGN KEY (id_answer) REFERENCES answers(id),
)


