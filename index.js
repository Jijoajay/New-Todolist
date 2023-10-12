import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;
mongoose.connect("mongodb+srv://jijoajay45:Jijo%40123%23@cluster0.g57ujog.mongodb.net/todoListDB")

const regularListSchema = new mongoose.Schema({
    name : String
})
const workListSchema = new mongoose.Schema({
    name : String
})
const RegularList = mongoose.model("RegularList",regularListSchema)
const WorkList = mongoose.model("WorkList",workListSchema)
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/',async(req,res)=>{
    const allRegularlist = await RegularList.find();
    res.render("index.ejs",{list:allRegularlist})
})
app.post('/add',async(req,res)=>{
    const listName = req.body.listName;
    if (listName === "Today's Todo List") {
        const regularLists = req.body['add'];
            const newList = RegularList({
                name:regularLists
            }) 
            newList.save()
            const allRegularlist = await RegularList.find();
            res.render('index.ejs',{list:allRegularlist, today:true})
        } else {
            const workLists = req.body['add'];
            const newWorkList = WorkList({
                name: workLists
            })
            newWorkList.save()
            const allWorkList = await WorkList.find()
            res.render("index.ejs",{list:allWorkList, work:true})
        }
        
    })
    app.get('/today',async(req,res)=>{
        const allRegularlist = await RegularList.find();
        res.render("index.ejs",{today:true, 
        list : allRegularlist});
    })
    app.get('/work',async(req,res)=>{
        const allWorkList = await WorkList.find()
        res.render("index.ejs",{work:true, list: allWorkList})
})
    app.post('/delete',async(req,res)=>{
        const wantToDeleteList = req.body.itemId;
        const listName = req.body.listName;
        try{
            if(listName === "Today's Todo List"){
                await RegularList.findByIdAndDelete(wantToDeleteList);
                res.redirect('/today')
            }else{
                await WorkList.findByIdAndDelete(wantToDeleteList);
                res.redirect('/work')
            }
        }catch(err){
            console.log(`this is the err ${err}`)
        }
    })
app.listen(port,()=>{
    console.log(`the server is running in ${port}`)
})

