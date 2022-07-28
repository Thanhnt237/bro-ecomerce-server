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
    LOCATION text,
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
    PRODUCT_OPTIONS text charset utf8mb4,
    NUMBER_PRODUCT int default 0,
    GALLERY text charset utf8mb4,
    DELIVERY_PRICE bigint default 25000,
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
    APPLY_ALL boolean default false,
    SELLER_ID varchar(50),
    STATE boolean default true,
    UNIQUE (VOUCHER_CODE),
    primary key (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.REF_VOUCHER_PRODUCT}(
    ID varchar(100) not null,
    VOUCHER_ID varchar(50),
    PRODUCT_ID varchar(50),
    CREATE_AT bigint,
    STATE boolean default true,
    UNIQUE (VOUCHER_ID, PRODUCT_ID),
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

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.CART} (
    ID varchar(50) not null,
    USER_ID varchar(50) not null,
    PRODUCT_ID varchar(50) not null,
    PRODUCT_OPTIONS varchar(50) not null,
    COUNT_PRODUCT bigint default 0,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    STATE boolean default true,
    UNIQUE (USER_ID, PRODUCT_ID),
    CONSTRAINT FK_REF_CART_TO_USER FOREIGN KEY (USER_ID) REFERENCES ${TABLE_NAME.USER} (ID),
    CONSTRAINT FK_REF_CART_TO_PRODUCT FOREIGN KEY (PRODUCT_ID) REFERENCES ${TABLE_NAME.PRODUCT} (ID),
    primary key (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.COMMENT} (
    ID varchar(50) not null,
    USER_ID varchar(50) not null,
    PRODUCT_ID varchar(50) not null,
    CONTENTS varchar(50) not null,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    STATE boolean default true,
    primary key (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.DELIVERY_INFORMATION} (
    ID varchar(50) not null,
    USER_ID varchar(50) not null,
    NAME text charset utf8mb4,
    PHONE_NUMBER varchar(50) not null,
    ADDRESS text charset utf8mb4,
    DELIVERY_METHOD text charset utf8mb4,
    DELIVERY_STATE text charset utf8mb4,
    TOTAL_PRICE bigint,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    STATE boolean default true,
    CONSTRAINT FK_REF_ORDER_TO_USER FOREIGN KEY (USER_ID) REFERENCES ${TABLE_NAME.USER} (ID),
    primary key (ID)
);

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.ORDER_DETAILS} (
    ID varchar(50) not null,
    DELIVERY_INFORMATION_ID varchar(50) not null,
    PRODUCT_ID varchar(50) not null,
    PRODUCT_OPTIONS varchar(50) not null,
    QUANTITY int,
    CREATE_AT bigint,
    UPDATE_AT bigint,
    STATE boolean default true,
    CONSTRAINT FK_REF_ORDER_TO_INFORMATION FOREIGN KEY (DELIVERY_INFORMATION_ID) REFERENCES ${TABLE_NAME.DELIVERY_INFORMATION} (ID),
    CONSTRAINT FK_REF_ORDER_TO_PRODUCT FOREIGN KEY (PRODUCT_ID) REFERENCES ${TABLE_NAME.PRODUCT} (ID),
    primary key (ID)
);

`;
