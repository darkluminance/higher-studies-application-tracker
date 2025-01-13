-- +goose Up

CREATE OR REPLACE FUNCTION remove_deleted_faculty()
RETURNS TRIGGER AS $$ BEGIN UPDATE university_application SET shortlisted_faculties_id = array_remove(shortlisted_faculties_id, OLD.id) WHERE OLD.id = ANY(shortlisted_faculties_id); RETURN NULL; END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_deleted_recommender()
RETURNS TRIGGER AS $$ BEGIN UPDATE university_application SET recommenders_id = array_remove(recommenders_id, OLD.id) WHERE OLD.id = ANY(recommenders_id); RETURN NULL; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_faculty
AFTER DELETE ON faculty
FOR EACH ROW
EXECUTE FUNCTION remove_deleted_faculty();

CREATE TRIGGER on_delete_recommender
AFTER DELETE ON recommender
FOR EACH ROW
EXECUTE FUNCTION remove_deleted_recommender();

-- +goose Down

DROP FUNCTION IF EXISTS remove_deleted_faculty;
DROP FUNCTION IF EXISTS remove_deleted_recommender;
DROP TRIGGER IF EXISTS on_delete_faculty;
DROP TRIGGER IF EXISTS on_delete_recommender;