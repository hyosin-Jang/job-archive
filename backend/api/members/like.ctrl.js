"use strict";

require("dotenv").config();
const { Like } = require('../../models'); 
const {UniqueConstraintError} = require('sequelize');


/* POST /api/like */
exports.Like = async (req, res) => {
    //특정 공고에 좋아요 설정( like db에 로그인한 userid & 해당 공고의 jobid 삽입 )
    const loggedID = res.locals.userid;
    const jobID = req.body.jobid;       //body
    //const jobID = req.params.jobid;   //path
    console.log("this is like");

    if (!jobID) //400: wantedAuthNo 미입력
        return res.status(400).send();
    try {
        await Like.create({
            userid: loggedID,
            wantedAuthNo: jobID,
        })
        .then((result) => {
            if(result){
                res.status(200).send({ result });
            }
        })
        .catch((err) => {
            if(err instanceof UniqueConstraintError){
                console.log("이미 좋아요한 공고");
                res.status(404).send(); //404: 이미 좋아요한 공고
            }
            else
                console.log("Like Error: ", err);
                res.status(408).send(); //408
        });
    } catch (e) {
      console.error(e);
      res.status(500).send(); //500
    }
};

/* DELETE /api/unlike/:jobid */
exports.UnLike = async (req, res) => {
    //특정 공고에 좋아요 해제( like db에서 로그인한 userid & 해당 공고의 jobid 삭제 )
    const loggedID = res.locals.userid;
    const jobID = req.params.jobid; 
    console.log(jobID);
    console.log("this is unlike");

    if (!jobID) //400: wantedAuthNo 미입력
        return res.status(400).send();
    try {
        await Like.destroy({ where: {userid: loggedID, wantedAuthNo: jobID }
        })
        .then((result) => {
            if(result){
                res.status(200).send({ result });
            }
            res.status(404).send(); //404: 좋아요 되어있지 않은 공고
        })
        .catch((err) => {
            console.log("Unlike Error: ", err);
            res.status(408).send(); //408
        });
    } catch (e) {
      console.error(e);
      res.status(500).send(); //500
    }
};