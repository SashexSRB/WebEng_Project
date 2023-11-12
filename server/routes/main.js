const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

const loggedInMainLayout= '../views/layouts/logged_in_main';
const mainLayout = '../views/layouts/main';

//Routes
//Home Route

//check login
const isLoggedIn = (req, res) => {
    try {
        const token = req.cookies.token;
        console.log(token);

        if(!token) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NERVPost",
            description: "NERV's Official Homepage"
        }
        const data  = await Post.find();
        if(isLoggedIn){
            res.render('index', { locals, layout: loggedInMainLayout, data });
        } else {
            res.render('index', { locals, layout: mainLayout, data });
        }
    } catch (error) {
        console.log(error);
    }
});

//Posts route
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data  = await Post.findById({_id: slug});

        const locals = {
            title: `NERVPost: ${data.title}`,
            description: "NERV's Official Homepage"
        }

        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
});
//Search post route
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "NERV's Official Homepage"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data  = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecChar, 'i')}},
                { body: { $regex: new RegExp(searchNoSpecChar, 'i')}},
            ]
        });
        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;


//Insert Test Blog
/*function insertPostData () {
    Post.insertMany([
        {
            "title": "The Enigma of NERV's Headquarters",
            "body": "Discover the secrets within the heart of NERV's central command. Our headquarters, concealed beneath the city's hustle, holds mysteries that unfold as we explore the inner workings of our organization's primary base. From the labyrinthine corridors to the state-of-the-art command center, every aspect of our headquarters is designed with precision and purpose. Join us in unraveling the layers of security, the advanced technology powering our operations, and the dedicated personnel ensuring the seamless functioning of this enigmatic fortress. The significance of Tokyo-3 as a focal point in the battle against unknown forces becomes clearer as we delve into the strategic positioning and defensive measures adopted by NERV's command center."
          },
          {
            "title": "Eva Units: Guardians of Humanity",
            "body": "Embark on a journey into the marvels of the Evangelion Units, the colossal bio-mechanical wonders that stand as humanity's ultimate protectors. This post delves into the cutting-edge technology and design behind these awe-inspiring machines. From the biomechanical synch ratios to the advanced weaponry embedded within their frames, each Eva Unit is a testament to human innovation in the face of existential threats. Join us in exploring the rigorous training regimes undergone by our elite pilots, the synchronization process that binds them to their Units, and the tactical considerations in deploying these mighty guardians. The awe-inspiring scale and power of the Eva Units are not just a testament to our defense capabilities but also a symbol of humanity's resilience against the unknown."
          },
          {
            "title": "Commander Gendo Ikari: Unraveling the Strategic Mind",
            "body": "Commander Gendo Ikari, the stoic leader at the helm of NERV, plays a pivotal role in the success of our organization. Join us in unraveling the layers of his strategic mind and understanding the decisions that shape the destiny of our collective mission. Gendo's enigmatic demeanor and calculated actions have been a subject of intrigue among our personnel. This post delves into his leadership style, the strategic considerations behind his decisions, and the delicate balance between humanity's survival and personal sacrifice. As we explore the complexities of Commander Ikari's character, we gain insights into the challenges and sacrifices inherent in leading an organization dedicated to safeguarding the future of humanity."
          },
          {
            "title": "NERV's Dark Past: Origins and Strategies",
            "body": "Explore the historical foundation of NERV, from its earliest days to the present. This post delves into the strategic decisions, alliances, and initiatives that have shaped the organization, revealing the complex tapestry of our past. NERV's origins lie in a tumultuous history marked by global threats and the need for a unified defense against the unknown. Join us in uncovering the geopolitical landscape that led to the formation of NERV, the strategic alliances forged in the crucible of crisis, and the organization's evolution over time. By understanding our dark and intricate past, we gain valuable insights into the strategies that have allowed NERV to stand as a bulwark against existential threats to humanity."
          },
          {
            "title": "Operational Insights: The Role of Our Pilots",
            "body": "Within our ranks, pilots take center stage in the ongoing battle to safeguard humanity. This post analyzes the skills, dedication, and pivotal moments defining the roles of our elite pilots as they face the challenges ahead. The selection and training of NERV's pilot corps are rigorous processes designed to forge individuals capable of facing the unknown with courage and resilience. Join us in exploring the unique abilities of each pilot, the psychological toll of piloting an Eva Unit, and the camaraderie that binds them in the face of adversity. As we delve into the personal journeys of our pilots, we gain a deeper appreciation for the human factor that defines our organization's ability to confront existential threats."
          },
          {
            "title": "NERV's Cryptic Symbols: Decoding the Iconography",
            "body": "Delve into the symbolic language that adorns NERV's infrastructure. This post takes you on a journey to decode the meaning behind our distinctive iconography, unraveling the symbolism woven into the fabric of our organization. From the enigmatic logos to the symbolic color choices, every aspect of NERV's visual identity holds deeper meanings. Join us in deciphering the symbolism behind our emblems, the significance of color patterns, and the intentional design choices that reflect our values and mission. By understanding the cryptic symbols that define NERV, we gain insight into the organization's ethos and the powerful narrative it weaves in the struggle against the unknown."
          },
          {
            "title": "Understanding Threats: Beyond Earthly Realms",
            "body": "Embark on an exploration of enigmatic threats that transcend our understanding of the natural world. This post dives into the origins, characteristics, and existential challenges posed by mysterious forces beyond our earthly realms. The threats faced by NERV are not confined to the earthly domain; they extend into the uncharted territories of cosmic mysteries. Join us in unraveling the unique characteristics of these otherworldly adversaries, the existential challenges they pose, and the innovative strategies employed by NERV to confront them. By expanding our understanding of the threats that transcend earthly boundaries, we gain a broader perspective on the cosmic struggle that defines NERV's mission."
          },
          {
            "title": "NERV Personnel: Unsung Heroes Behind the Scenes",
            "body": "While our pilots take the spotlight, unsung heroes work tirelessly in the shadows. Join us in acknowledging the contributions of NERV's support staff, engineers, and strategists who play crucial roles in the success of our collective mission. Beyond the frontlines, NERV's success hinges on the dedication and expertise of the unsung heroes working behind the scenes. This post shines a light on the diverse roles within our organization, from the brilliant engineers maintaining Eva Units to the strategic minds orchestrating our operations. By recognizing the collective efforts of NERV personnel, we gain a deeper appreciation for the teamwork and collaboration that underpin our ability to face the unknown."
          },
          {
            "title": "The Impact of Instrumentality: NERV's Philosophical Exploration",
            "body": "Philosophical questions about human existence are at the forefront of our organization's considerations. This post explores the concept of Instrumentality, its implications, and the philosophical journey it sparks within our collective consciousness. Instrumentality, a concept at the intersection of philosophy and existentialism, explores the nature of human existence and the boundaries between individual consciousness. Join us in contemplating the impact of Instrumentality on NERV's mission, the philosophical questions it raises, and the profound implications for humanity. By delving into the philosophical exploration within NERV, we gain a deeper understanding of the profound questions that drive our organization's commitment to safeguarding the future of humanity."
          },
          {
            "title": "NERV's Global Influence: Beyond Operational Centers",
            "body": "While our primary focus is on Tokyo-3, NERV's influence extends globally. Join us in examining the geopolitical implications of NERV's actions, alliances, and the international response to the challenges we face. Tokyo-3 may be our primary operational center, but the impact of NERV resonates globally. This post explores the geopolitical landscape shaped by NERV's actions, the alliances forged with international partners, and the responses of nations to the challenges posed by existential threats. By understanding NERV's global influence, we gain insight into the intricate web of international relations and the collaborative efforts required to secure humanity's future in the face of the unknown."
          }
    ])
};
insertPostData();*/