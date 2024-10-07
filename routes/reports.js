import express from 'express';
import { sendReport } from '../services/email.js';
import { getFilesForUser, getFilesFromArchiveForUser } from '../db/blob.js';
import { format } from 'date-fns';

const router = express.Router();

const mapKidsAndArchiveArrays = (kids, archive) => {
  const parsedArchive = archive.map(item => {
    return {
      name: item.name,
      archiveUrl: item.url
    }
  })
  const array = kids.map((item, i) => Object.assign({}, item, parsedArchive[i]));
  return array;
}

router.get('/', async (req, res, next) => {
    try {
        if(req.cookies["userData"]) {
          const userId = req.cookies["userData"][1];
          const kids = await getFilesForUser(userId);
          const archive = await getFilesFromArchiveForUser(userId);
          const combinedArray = mapKidsAndArchiveArrays(kids, archive)
          return res.render("report.pug", {sent: !!req.query.sent, kids: combinedArray});
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
    const archive = await getFilesFromArchiveForUser(userId);
    const combinedArray = mapKidsAndArchiveArrays(kids, archive)
    const html = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Załączniki</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 8px;
            }
            h2 {
                color: #2c3e50;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            table, th, td {
                border: 1px solid #ddd;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
                color: #333;
            }
            td {
                text-align: left;
            }
            a {
                color: #3498db;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Załączniki wysłane z konta: ${userId}</h2>
            <p>Poniżej znajduje się lista załączników wysłanych z Twojego konta:</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Link do załącznika</th>
                    </tr>
                </thead>
                <tbody>
                    ${combinedArray.map(kid => {
                        return `
                        <tr>
                            <td>${kid.name}</td>
                            <td><a href="${kid.archiveUrl}" target="_blank">${kid.archiveUrl}</a></td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
    
        </div>
    </body>
    </html>
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