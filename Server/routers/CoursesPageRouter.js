const express = require("express");
const router = express.Router();
const courses_router = express.Router();
const block_router = express.Router();
const lecture_router = express.Router();
const lesson_router = express.Router();
const register_to_course_router = express.Router();
const lesson_marked_router = express.Router();
const category_router = express.Router();
const popular_course_router = express.Router();
const recommended_course_router = express.Router();

const db = require("../database/db");

router.use("/categories", category_router);
router.use("/popular", popular_course_router);
router.use("/recommended", recommended_course_router);
router.use("/", courses_router); // "/courses?course_id=1"
router.use("/blocks", block_router);
router.use("/blocks/lectures", lecture_router);
router.use("/blocks/lectures/lessons", lesson_router);
router.use("/marked", lesson_marked_router);
router.use("/register", register_to_course_router);

category_router.route("/").get(async (req, res) => {
	console.log("/courses/categories GET");
	// Get all the categories
	const categories = await db.getCategories();
	if (categories != null) res.status(200); // OK
	else res.status(404);
	res.json(categories);
});
popular_course_router.route("/").get(async (req, res) => {
	console.log("/courses/popular GET");
	// Get all the popular courses
	const popular_courses = await db.getPopularCourses();
	if (popular_courses != null) res.status(200); // OK
	else res.status(404);
	res.json(popular_courses);
});

recommended_course_router.route("/").get(async (req, res) => {
	console.log("/courses/recommended GET");
	// Get all the recommended courses
	const recommended_courses = await db.getRecommendedCourses();
	if (recommended_courses != null) res.status(200); // OK
	else res.status(404);
	res.json(recommended_courses);
});

courses_router.route("/").get(async (req, res) => {
	console.log("/courses GET");
	const course_id = req.query.course_id;

	const course_info = await db.getCourse(course_id);
	console.log("here it is");
	console.log(course_info);
	if (course_info) res.status(200); // OK
	else res.status(404); // Not found
	res.json(course_info);
});

// Sends all the blocks of a course
block_router.route("/").get(async (req, res) => {
	console.log("/courses/blocks GET");
	const course_id = req.query.course_id;

	// Get data from database using block_id

	const blocks_list = await db.getBlockList(course_id);
	console.log(blocks_list);


	if (blocks_list != null) res.status(200); // OK
	else res.status(404); // Not found
	res.json(blocks_list);
});

lecture_router.route("").get(async (req, res) => {
	console.log("/courses/blocks/lectures GET");
	// Get all the lectures under a block
	const block_id = req.query.block_id;

	const lecture_list = await db.getLectureList(block_id);

	if (lecture_list != null) res.status(200); // OK
	else res.status(404); // Not found
	res.json(lecture_list);
});

register_to_course_router.route("/").post(async (req, res) => {
	console.log("/courses/register POST");
	// Register a user to a course
	const course_id = req.body.course_id; // Get course_id from frontend
	const enroll_date = new Date();
	const enrollment_status = "active";
	const last_activity = new Date();

	// console.log(req.session.username);
	// const user = await db.getUser(req.session.username);
	const user_id = 1;
	console.log("user_id: ", user_id);
	console.log("course_id: ", course_id);

	// CREATE TABLE IF NOT EXISTS enrolled_courses (
	// 	user_id INT REFERENCES users(user_id),
	// 	course_id INT REFERENCES courses(course_id),
	// 	enroll_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
	// 	feedback TEXT,
	// 	rating DECIMAL(2, 1),
	// 	enrollment_status VARCHAR(100),                                         -- 'active', 'completed', 'dropped'
	// 	last_activity TIMESTAMP WITHOUT TIME ZONE,
	// 	PRIMARY KEY (user_id, course_id)
	// );
	const registered = await db.registerToCourse(user_id, course_id, enroll_date, enrollment_status, last_activity);

	// if (registered.length > 0) res.status(200).send();
	// else res.status(404).send(); 
	res.status(200).send();
});

lesson_router.route("/").get(async (req, res) => {
	console.log("/courses/blocks/lectures/lessons GET");
	// Get all the lessons under a lecture
	const lecture_id = req.query.lecture_id;

	const lesson_list = await db.getLessonList(lecture_id);
	if (lesson_list != null) res.status(200); // OK
	else res.status(404); // Not found
	res.json(lesson_list);
});

module.exports = router;
