const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const multer = require("multer");

const app = express();
app.use(cors());
// multer 설정 (파일을 메모리에 저장)
const upload = multer();
const uri = "mongodb+srv://qc70045:Kysbandi12!@cluster0.dboj85a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let database;

async function connectDB() {
    await client.connect();
    console.log("Connected to MongoDB");
    database = client.db("todoapp"); // 데이터베이스 객체를 전역 변수에 저장
}


connectDB().catch(console.error);

app.get('/commentdata', async (req, res) => {

    const comments = database.collection("comment");
    try {
        const commentData = await comments.find({}).toArray();
        res.json(commentData);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/counterdata', async (req, res) => {

    const comments = database.collection("counter");
    try {
        const commentData = await comments.find({}).toArray();
        res.json(commentData);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/loginData', async (req, res) => {

    const comments = database.collection("login");
    try {
        const commentData = await comments.find({}).toArray();
        res.json(commentData);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/postData', async (req, res) => {

    const comments = database.collection("post");
    try {
        const commentData = await comments.find({}).toArray();
        res.json(commentData);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/postData', upload.single('file'), async (req, res) => {
    const { title, content } = req.body; // 클라이언트로부터 받은 게시글 데이터
    const file = req.file; // 클라이언트로부터 받은 파일 데이터

    try {
        const posts = database.collection("post");

        // 파일이 존재하는 경우 처리 로직
        let filePath = "";
        if (file) {
            // 파일을 파일 시스템에 저장하고, 그 위치를 filePath 변수에 저장
            // 예: filePath = "uploads/" + file.originalname;
        }

        // 파일 경로가 있으면 파일 정보와 함께, 없으면 파일 정보 없이 데이터베이스에 저장
        const result = await posts.insertOne({
            title,
            content,
            ...(filePath && {filePath}) // 파일 경로가 있을 때만 filePath 필드 추가
        });

        res.status(201).json(result); // 성공 응답
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/recipeData', async (req, res) => {
    const recipes = database.collection("recipe");
    try {
        const recipeData = await recipes.find({}).toArray();
        res.json(recipeData);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.delete('/recipes/:recipeId/comments/:commentId', async (req, res) => {
    const { recipeId, commentId } = req.params;

    try {
        await client.connect();
        const recipes = database.collection("recipe");

        const updateResult = await recipes.updateOne(
            { id: parseInt(recipeId) },
            { $pull: { comments: { c_id: parseInt(commentId) } } }
        );

        if (updateResult.modifiedCount === 1) {
            res.status(200).json({ message: "Comment deleted successfully" });
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.post('/recipeData/:id/like', async (req, res) => {
    const { id } = req.params; // 레시피 ID 파싱, 이제 'id'를 사용합니다.
    try {
        await client.connect();
        const recipes = database.collection("recipe");

        // MongoDB의 updateOne 메소드를 사용하여 totalLike 값을 증가
        // 'id' 필드를 문자열로 비교합니다.
        const updateResult = await recipes.updateOne(
            { id: parseInt(id) }, // 'id' 필드에 문자열 대신 숫자를 사용하는 경우 parseInt 또는 적절한 변환 필요
            { $inc: { totalLike: 1 } } // totalLike 값을 1만큼 증가
        );

        if (updateResult.modifiedCount === 1) {
            res.status(200).send("Like updated successfully");
        } else {
            res.status(404).send("Recipe not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

// 댓글 좋아요 업데이트
app.post('/comments/:c_id/like', async (req, res) => {
    const { c_id } = req.params;
    try {
        const updateResult = await database.collection("comments").updateOne(
            { "comments.c_id": parseInt(c_id) },
            { $inc: { "comments.$.like": 1 } }
        );
        if (updateResult.modifiedCount === 1) {
            res.status(200).send({ message: "Like updated successfully" });
        } else {
            res.status(404).send({ message: "Comment not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// 댓글 싫어요 업데이트
app.post('/comments/:c_id/dislike', async (req, res) => {
    const { c_id } = req.params;
    try {
        const updateResult = await database.collection("comments").updateOne(
            { "comments.c_id": parseInt(c_id) },
            { $inc: { "comments.$.dislike": 1 } }
        );
        if (updateResult.modifiedCount === 1) {
            res.status(200).send({ message: "Dislike updated successfully" });
        } else {
            res.status(404).send({ message: "Comment not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
    }
});




app.get('/detailData/:id', async (req, res) => {
    const database = client.db("todoapp");
    const recipes = database.collection("recipe");
    const id = parseInt(req.params.id); // URL에서 id 파라미터를 추출하고 숫자로 변환

    try {
        // MongoDB에서 id에 해당하는 레시피 문서를 찾습니다.
        const recipeData = await recipes.findOne({ id: id });
        if (recipeData) {
            res.json(recipeData); // 문서가 존재하면 JSON 형태로 응답
        } else {
            res.status(404).send("Recipe not found"); // 문서가 없으면 404 Not Found 응답
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error"); // 서버 내부 오류 처리
    }
});

// 서버 종료 시 연결 닫기
async function closeDBConnection() {
    await client.close();
    console.log("Disconnected from MongoDB");
}

process.on('SIGINT', closeDBConnection);
process.on('SIGTERM', closeDBConnection);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
