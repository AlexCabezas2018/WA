CREATE TABLE user (
    email VARCHAR2(255) NOT NULL PRIMARY KEY,
    pass VARCHAR2(255) NOT NULL,
    username VARCHAR2(255) NOT NULL,
    gender VARCHAR2(255) NOT NULL,
    register_date DATE NOT NULL,
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
    question_body VARCHAR(255) NOT NULL
)

CREATE TABLE own_history_answers(
    username VARCHAR2(255) NOT NULL,
    id_question INT NOT NULL,
    id_answer INT NOT NULL,

    FOREIGN KEY (username) REFERENCES user(email),
    FOREIGN KEY (id_question) REFERENCES questions(id),
    FOREIGN KEY (id_answer) REFERENCES answers(id),

    PRIMARY KEY (username,id_question,id_answer)
)

CREATE TABLE friends_history_answers(
    username VARCHAR2(255) NOT NULL,
    friend_username VARCHAR(255) NOT NULL,
    id_question INT NOT NULL,
    id_answer INT NOT NULL,

    FOREIGN KEY (username,friend_username) REFERENCES user(email),
    FOREIGN KEY (id_question) REFERENCES questions(id),
    FOREIGN KEY (id_answer) REFERENCES answers(id),

    PRIMARY KEY (username,friend_username,id_question,id_answer)

)

--TODO Como colocar que respuesta es la correcta