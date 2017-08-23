BEGIN;

CREATE SCHEMA dummy;

CREATE TABLE dummy.foo (
	id                                    text,
	time                                TIMESTAMP,
    course							    numeric,
	estimated 						  boolean,

	CONSTRAINT foo_id_pk 	PRIMARY KEY(id)
);


COMMIT;


