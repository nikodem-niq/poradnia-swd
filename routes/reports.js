import express from 'express';
import { sendReport } from '../services/email.js';
import { getFilesForUser } from '../db/blob.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        if(req.cookies["userData"]) {
          const userId = req.cookies["userData"][1];
          const kids = await getFilesForUser(userId);
          return res.render("report.pug", {sent: !!req.query.sent, kids});
        } else {
          return res.render('index.pug', {error: false});
        }
    } catch(err) {
        console.log(err);
    }
});

router.post('/send', async (req, res) => {
  if(req.cookies["userData"]) {
    const userId = req.cookies["userData"][1];
    const email = req.body.genreport;
    const kids = await getFilesForUser(userId);
    const html = 
    `Załączniki wysłane z konta: ${userId} <br /> 
    ${kids.map(kid => {
        return `${kid.name} - ${kid.url} <br />`;
    }).join('')}
    `;

    await sendReport(email, html);
    res.redirect('/?sent=true');
  } else {
    res.redirect('/');
  }
});

router.get('/age6', (req,res,next) => {
    if(req.cookies["userData"]){
      res.render('age6.pug'); 
    }
  })
  
  router.get('/age7', (req,res,next) => {
    if(req.cookies["userData"]){
      res.render('age7.pug'); 
    }
  })


export default router;