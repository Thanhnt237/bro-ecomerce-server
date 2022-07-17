const TABLE_NAME = require("./tablename").TABLE_NAME

require('dotenv').config();
module.exports = `
CREATE TABLE IF NOT EXISTS ${TABLE_NAME.CATEGORIES}(
    ID varchar(50) not null,
    CATEGORIES_NAME text charset utf8mb4,
    SLUG varchar(200),
    DESCRIPTION text charset utf8mb4,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    STATE boolean default true,
    UNIQUE (SLUG),
    primary key (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.SELLER}(
    ID varchar(50) not null,
    SELLER_NAME text charset utf8mb4,
    PHONE_NUMBER text charset utf8mb4 not null,
    MAIN_CATEGORIES text charset utf8mb4,
    EMAIL varchar(50) not null,
    PASSWORD varchar(220) not null,
    ROLE varchar(20) default 'SELLER',
    RATING text charset utf8mb4,
    FOLLOWER bigint,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    STATE boolean default true,
    UNIQUE (PHONE_NUMBER),
    UNIQUE (EMAIL),
    primary key (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.PRODUCT} (
    ID varchar(50) not null,
    PRODUCT_NAME text charset utf8mb4,
    SELLER_ID varchar(50) not null,
    CATEGORY_ID varchar(50),
    DETAILS text charset utf8mb4,
    DESCRIPTION text charset utf8mb4,
    PRICE bigint default 0,
    PRODUCT_DESCRIPTION text charset utf8mb4,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    PRODUCT_LOCK boolean default false,
    STATE boolean default true,
    primary key (ID),
    CONSTRAINT FK_PRODUCT_TO_SELLER FOREIGN KEY (SELLER_ID) REFERENCES ${TABLE_NAME.SELLER} (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.VOUCHER}(
    ID varchar(50) not null,
    VOUCHER_NAME text charset utf8mb4,
    VOUCHER_CODE varchar(30),
    DISCOUNT_PRICE text charset utf8mb4,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    VALID_UNTIL bigint,
    STATE boolean default true,
    UNIQUE (VOUCHER_CODE),
    primary key (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.REF_VOUCHER_PRODUCT}(
    ID varchar(50) not null,
    VOUCHER_ID varchar(50),
    PRODUCT_ID varchar(50),
    CREATE_AT bigint,
    STATE boolean default true,
    primary key (ID),
    CONSTRAINT FK_REF_TO_VOUCHER FOREIGN KEY (VOUCHER_ID) REFERENCES ${TABLE_NAME.VOUCHER} (ID),
    CONSTRAINT FK_REF_TO_PRODUCT FOREIGN KEY (PRODUCT_ID) REFERENCES ${TABLE_NAME.PRODUCT} (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.USER} (
    ID varchar(50) not null,
    EMAIL varchar(50) not null,
    PASSWORD varchar(220) not null,
    ROLE varchar(20) default 'USER',
    FIRST_NAME text charset utf8mb4,
    LAST_NAME text charset utf8mb4,
    DATE_OF_BIRTH text charset utf8mb4,
    GENDER text charset utf8mb4,
    NATIONALITY text charset utf8mb4,
    ADDRESS text charset utf8mb4,
    PHONE_NUMBER text charset utf8mb4,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    STATE boolean default true,
    primary key (ID)
);


`;
