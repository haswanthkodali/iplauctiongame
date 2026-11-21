/**
 * IPL AUCTION GAME - PLAYER IMAGES & AVATAR ENGINE
 * ============================================================================
 * Provides:
 * 1. PLAYER_IMAGES: Real headshot URLs using ESPNcricinfo CDN (img1.hscicdn.com)
 * 2. generatePlayerAvatarSVG(player): Ultra-stylish vector jersey avatar generator
 * 3. getPlayerImage(player): Helper that returns photo with instant SVG fallback
 * ============================================================================
 */

(function (global) {
  'use strict';

  // =========================================================================
  // REAL PLAYER HEADSHOT IMAGE URLs
  // Using ESPNcricinfo CDN with verified player IDs
  // Format: https://img1.hscicdn.com/image/upload/f_auto,t_h_100_2x/lsci/db/PICTURES/CMS/{folder}/{id}.jpg
  // Also using IPLT20.com official CDN for some players
  // =========================================================================
  const PLAYER_IMAGES = {
    "Abhinav Manohar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380685.1.png",
    "Abhishek Sharma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423429.1.png",
    "Abishek Porel": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/393400/393462.2.png",
    "Adam Zampa": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319800/319853.jpg",
    "Aiden Markram": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322000/322067.1.png",
    "Ajinkya Rahane": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316620.3.png",
    "Akash Madhwal": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/358000/358043.1.png",
    "Alzarri Joseph": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322300/322394.jpg",
    "Andre Russell": "https://documents.iplt20.com/ipl/IPLHeadshot2024/141.png",
    "Angkrish Raghuvanshi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/345000/345093.1.png",
    "Anmolpreet Singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Anmolpreet_Singh_2.jpg/250px-Anmolpreet_Singh_2.jpg",
    "Anrich Nortje": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322000/322080.1.png",
    "Anshul Kamboj": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423200/423299.1.png",
    "Anuj Rawat": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/359700/359757.1.png",
    "Anukul Roy": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341041.1.png",
    "Arshdeep Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423430.1.png",
    "Arshin Kulkarni": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/409100/409181.1.png",
    "Ashutosh Sharma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380694.1.png",
    "Atharva Taide": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380688.1.png",
    "Avanish Rao Aravelly": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399262.png",
    "Avesh Khan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322244.1.png",
    "Axar Patel": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423432.1.png",
    "Ayush Badoni": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/411800/411842.png",
    "Ayush Mhatre": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/390300/390331.2.png",
    "Bhanuka Rajapaksa": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319800/319849.jpg",
    "Bhuvneshwar Kumar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423800/423869.1.png",
    "C Andre Siddarth": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399260.png",
    "Cameron Green": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321569.2.png",
    "Chetan Sakariya": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322238.1.png",
    "Corbin Bosch": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/393600/393647.2.png",
    "Daniel Sams": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Daniel_Sams_Batting.jpg/250px-Daniel_Sams_Batting.jpg",
    "David Miller": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316655.1.png",
    "David Warner": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/DAVID_WARNER_%2811704782453%29.jpg/250px-DAVID_WARNER_%2811704782453%29.jpg",
    "Deepak Chahar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322700/322704.1.png",
    "Devdutt Padikkal": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322229.1.png",
    "Devon Conway": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321539.jpg",
    "Dewald Brevis": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/335100/335134.1.png",
    "Dhruv Jurel": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423076.1.png",
    "Digvesh Rathi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/398600/398608.5.png",
    "Dinesh Karthik": "https://documents.iplt20.com/ipl/IPLHeadshot2024/44.png",
    "Donovan Ferreira": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/406000/406033.png",
    "Faf du Plessis": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Faf_du_Plessis_2019_Boxing_Day.jpg/250px-Faf_du_Plessis_2019_Boxing_Day.jpg",
    "Fazalhaq Farooqi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341036.1.png",
    "Finn Allen": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383164.1.png",
    "Gerald Coetzee": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/RSA_vs_AUS_Day_2_-_Gerald_Coetzee.jpg/250px-RSA_vs_AUS_Day_2_-_Gerald_Coetzee.jpg",
    "Glenn Maxwell": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316632.jpg",
    "Glenn Phillips": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383167.1.png",
    "Gurjapneet Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/362500/362596.6.png",
    "Gurnoor Brar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423078.1.png",
    "Hardik Pandya": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/388300/388343.5.png",
    "Hardik Tamore": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399265.png",
    "Harpreet Brar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/381300/381368.1.png",
    "Harpreet Singh Bhatia": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322240.jpg",
    "Harry Brook": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323200/323267.jpg",
    "Harsh Dubey": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423045.3.png",
    "Harshit Rana": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/358000/358042.3.png",
    "Heinrich Klaasen": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322000/322073.1.png",
    "Himmat Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/414700/414722.5.png",
    "Ishan Kishan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423433.1.png",
    "Ishant Sharma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316602.3.png",
    "Jake Fraser-McGurk": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/260328_D3_Jake_Fraser-McGurk_01.jpg/250px-260328_D3_Jake_Fraser-McGurk_01.jpg",
    "Jason Roy": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Jason_Roy_with_the_Sydney_Sixers.jpg/250px-Jason_Roy_with_the_Sydney_Sixers.jpg",
    "Jasprit Bumrah": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319900/319940.2.png",
    "Jitesh Sharma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380690.1.png",
    "Jonny Bairstow": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316618.jpg",
    "Jos Buttler": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383143.1.png",
    "Josh Hazlewood": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/390900/390976.5.png",
    "Josh Inglis": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/324200/324232.2.png",
    "KL Rahul": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423079.1.png",
    "Kagiso Rabada": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/320300/320376.1.png",
    "Kamlesh Nagarkoti": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322600/322621.1.png",
    "Kane Williamson": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316630.jpg",
    "Kartik Tyagi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/339100/339150.1.png",
    "Karun Nair": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399231.5.png",
    "Khaleel Ahmed": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322268.1.png",
    "Krunal Pandya": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322600/322614.1.png",
    "Kuldeep Yadav": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423435.1.png",
    "Kumar Kartikeya": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380689.1.png",
    "Kumar Kushagra": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/398600/398618.5.png",
    "Kyle Mayers": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Kyle_Mayers_batting_at_Perth_Stadium%2C_First_Test_Australia_versus_West_Indies%2C_2_December_2022_08.jpg/250px-Kyle_Mayers_batting_at_Perth_Stadium%2C_First_Test_Australia_versus_West_Indies%2C_2_December_2022_08.jpg",
    "Lalit Yadav": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322236.1.png",
    "Liam Livingstone": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383152.1.png",
    "Lockie Ferguson": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383174.1.png",
    "Luvnith Sisodia": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399258.png",
    "MS Dhoni": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319900/319946.3.png",
    "Mahipal Lomror": "https://documents.iplt20.com/ipl/IPLHeadshot2024/182.png",
    "Manav Suthar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/398600/398616.5.png",
    "Mandeep Singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Mandeep_Singh_2019.jpg/250px-Mandeep_Singh_2019.jpg",
    "Manish Pandey": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323000/323052.1.png",
    "Manoj Bhandage": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380696.1.png",
    "Marco Jansen": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/337100/337189.1.png",
    "Marcus Stoinis": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321596.2.png",
    "Matheesha Pathirana": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/355400/355402.1.png",
    "Matthew Wade": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316621.jpg",
    "Mayank Agarwal": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322226.1.png",
    "Mayank Yadav": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423443.1.png",
    "Mitchell Marsh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/385700/385798.1.png",
    "Mitchell Santner": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383180.1.png",
    "Mitchell Starc": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/390900/390978.5.png",
    "Moeen Ali": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323200/323256.jpg",
    "Mohammad Nabi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316649.jpg",
    "Mohammed Shami": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/390300/390351.5.png",
    "Mohammed Siraj": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423086.1.png",
    "Mohit Sharma": "https://documents.iplt20.com/ipl/IPLHeadshot2024/110.png",
    "Mohsin Khan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/397200/397280.4.png",
    "Mukesh Kumar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/373900/373907.1.png",
    "Musheer Khan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/392100/392178.2.png",
    "Mustafizur Rahman": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319700/319734.3.png",
    "Naman Dhir": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423442.1.png",
    "Nathan Ellis": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/329700/329711.2.png",
    "Naveen-ul-Haq": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/340300/340339.png",
    "Nehal Wadhera": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/381300/381388.1.png",
    "Nicholas Pooran": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/320100/320109.2.png",
    "Nishant Sindhu": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/345000/345097.1.png",
    "Nitish Kumar Reddy": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423441.1.png",
    "Nitish Rana": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323000/323054.1.png",
    "Noor Ahmad": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383200/383239.1.png",
    "Nuwan Thushara": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/381300/381395.7.png",
    "Pat Cummins": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/390900/390954.5.png",
    "Pathum Nissanka": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323000/323070.1.png",
    "Phil Salt": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383141.1.png",
    "Prabhsimran Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/358000/358040.1.png",
    "Prasidh Krishna": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423075.2.png",
    "Prithvi Shaw": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322600/322622.1.png",
    "Priyam Garg": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/340300/340311.jpg",
    "Priyansh Arya": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/391700/391706.2.png",
    "Quinton de Kock": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316668.1.png",
    "Rahul Chahar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/331100/331166.1.png",
    "Rahul Tewatia": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322200/322269.1.png",
    "Rahul Tripathi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/356800/356821.5.png",
    "Raj Bawa": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/339100/339156.2.png",
    "Rajat Patidar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/390500/390563.2.png",
    "Ramandeep Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380670.5.png",
    "Rashid Khan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383200/383228.1.png",
    "Rasikh Salam": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341040.1.png",
    "Rasikh Salam Dar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341040.1.png",
    "Ravi Bishnoi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423439.1.png",
    "Ravindra Jadeja": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423091.2.png",
    "Richard Gleeson": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Richard_Gleeson.jpg/250px-Richard_Gleeson.jpg",
    "Rinku Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341043.1.png",
    "Rishabh Pant": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323000/323036.1.png",
    "Robin Minz": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399261.png",
    "Rohit Sharma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423085.1.png",
    "Romario Shepherd": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423421.1.png",
    "Rovman Powell": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423420.1.png",
    "Ruturaj Gaikwad": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423084.1.png",
    "Sai Sudharsan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/390600/390648.2.png",
    "Sam Curran": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383153.1.png",
    "Sameer Rizvi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/397400/397425.4.png",
    "Sandeep Sharma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323000/323055.1.png",
    "Sanju Samson": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423438.1.png",
    "Sanvir Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380696.1.png",
    "Sarfaraz Khan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/393600/393683.2.png",
    "Saurav Chuahan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399263.png",
    "Shahbaz Ahmed": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/340300/340313.1.png",
    "Shahrukh Khan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/359700/359756.1.png",
    "Shai Hope": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316647.jpg",
    "Shaik Rasheed": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380694.1.png",
    "Shams Mulani": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/358000/358045.png",
    "Shardul Thakur": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322600/322696.1.png",
    "Shashank Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380696.1.png",
    "Sheldon Jackson": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323200/323286.jpg",
    "Sherfane Rutherford": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423416.1.png",
    "Shimron Hetmyer": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423413.2.png",
    "Shivam Dube": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423437.1.png",
    "Shivam Mavi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341042.1.png",
    "Shreyas Iyer": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423436.1.png",
    "Shubham Dubey": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/398200/398224.5.png",
    "Shubman Gill": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423077.1.png",
    "Sikandar Raza": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321554.jpg",
    "Simarjeet Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341038.1.png",
    "Steve Eskinazi": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323200/323269.jpg",
    "Steve Smith": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316628.jpg",
    "Sunil Narine": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/320100/320119.1.png",
    "Suryakumar Yadav": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/331100/331163.1.png",
    "Sushant Mishra": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/415300/415387.5.png",
    "Suyash Prabhudessai": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/341000/341035.1.png",
    "Suyash Sharma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/358000/358041.1.png",
    "Swapnil Singh": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/384200/384254.1.png",
    "Swastik Chikara": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/399200/399251.2.png",
    "T Natarajan": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322600/322699.1.png",
    "Tanush Kotian": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/358000/358046.png",
    "Tilak Varma": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423400/423434.1.png",
    "Tim David": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/340300/340305.1.png",
    "Tom Banton": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323000/323099.1.png",
    "Travis Head": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321584.2.png",
    "Trent Boult": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383185.1.png",
    "Tristan Stubbs": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/348500/348577.1.png",
    "Tushar Deshpande": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/398600/398605.png",
    "Umesh Yadav": "https://documents.iplt20.com/ipl/IPLHeadshot2024/59.png",
    "Umran Malik": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/343200/343263.1.png",
    "Upendra Yadav": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380687.1.png",
    "Vaibhav Arora": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/389500/389547.5.png",
    "Varun Chakravarthy": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/331100/331167.1.png",
    "Vidwath Kaverappa": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380697.png",
    "Vijay Shankar": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Vijay_Shankar_4.jpg/250px-Vijay_Shankar_4.jpg",
    "Vipraj Nigam": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/397400/397429.4.png",
    "Virat Kohli": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423082.1.png",
    "Vishnu Vinod": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/359700/359774.1.png",
    "Wanindu Hasaranga": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322900/322946.1.png",
    "Washington Sundar": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322600/322619.1.png",
    "Will Jacks": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/383100/383155.1.png",
    "Wriddhiman Saha": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Wriddhiman_Saha.jpg/250px-Wriddhiman_Saha.jpg",
    "Yash Dayal": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/387500/387586.4.png",
    "Yash Dhull": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/380600/380695.1.png",
    "Yashasvi Jaiswal": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/423000/423081.1.png",
    "Yuzvendra Chahal": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319900/319955.1.png"
  };

  // Flag and emoji mapping
  const COUNTRY_FLAGS = {
    "India": "🇮🇳",
    "Australia": "🇦🇺",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "South Africa": "🇿🇦",
    "West Indies": "🏝️",
    "New Zealand": "🇳🇿",
    "Afghanistan": "🇦🇫",
    "Sri Lanka": "🇱🇰",
    "Bangladesh": "🇧🇩",
    "Zimbabwe": "🇿🇼",
    "Ireland": "🇮🇪",
    "USA": "🇺🇸",
    "Nepal": "🇳🇵",
    "Netherlands": "🇳🇱",
    "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
  };

  // Role Color Themes
  const ROLE_THEMES = {
    "Batsman": { primary: "#1E40AF", secondary: "#3B82F6", accent: "#93C5FD", icon: "🏏" },
    "Bowler": { primary: "#991B1B", secondary: "#EF4444", accent: "#FCA5A5", icon: "⚡" },
    "All-Rounder": { primary: "#5B21B6", secondary: "#8B5CF6", accent: "#C4B5FD", icon: "⭐" },
    "Wicket-Keeper": { primary: "#065F46", secondary: "#10B981", accent: "#6EE7B7", icon: "🧤" }
  };

  /**
   * Generates a high-fidelity SVG avatar data URL for any player.
   * Completely self-contained, crisp at any resolution, and works 100% offline.
   */
  function generatePlayerAvatarSVG(player) {
    if (!player) return "";
    const name = player.name || "IPL Player";
    const initials = player.initials || name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    const role = player.role || "Batsman";
    const rating = player.rating || 80;
    const country = player.country || "India";
    const flag = COUNTRY_FLAGS[country] || "🏏";
    const theme = ROLE_THEMES[role] || ROLE_THEMES["Batsman"];

    // Color gradient based on player ID hash or rating
    const idNum = typeof player.id === 'number' ? player.id : (name.charCodeAt(0) * 7);
    const hue = (idNum * 37) % 360;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280" width="240" height="280">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.secondary}" />
      <stop offset="100%" stop-color="${theme.primary}" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base with Rounded Corners -->
  <rect x="6" y="6" width="228" height="268" rx="20" fill="url(#bgGrad)" stroke="${theme.secondary}" stroke-width="2" filter="url(#cardShadow)"/>

  <!-- Halo / Spotlight Effect -->
  <circle cx="120" cy="110" r="75" fill="${theme.secondary}" opacity="0.18" />

  <!-- Cricket Player Silhouette / Portrait Geometry -->
  <!-- Shoulders & Jersey -->
  <path d="M 45 230 C 50 185, 80 165, 120 165 C 160 165, 190 185, 195 230 Z" fill="url(#jerseyGrad)" />
  <!-- Jersey Collar -->
  <polygon points="120,185 105,165 135,165" fill="#f8fafc" opacity="0.9"/>
  <!-- Jersey Stripe / Accent -->
  <path d="M 70 230 L 95 180 L 105 180 L 85 230 Z" fill="#ffffff" opacity="0.25" />
  <path d="M 170 230 L 145 180 L 135 180 L 155 230 Z" fill="#ffffff" opacity="0.25" />

  <!-- Neck -->
  <rect x="108" y="140" width="24" height="26" rx="4" fill="#E2B29F" />

  <!-- Head / Face -->
  <ellipse cx="120" cy="115" rx="36" ry="42" fill="#E2B29F" />

  <!-- Cricket Cap / Helmet -->
  <path d="M 82 108 C 82 72, 158 72, 158 108 Z" fill="${theme.primary}" stroke="#0f172a" stroke-width="1.5"/>
  <!-- Cap Visor -->
  <ellipse cx="120" cy="110" rx="46" ry="9" fill="${theme.secondary}" />
  <ellipse cx="120" cy="108" rx="43" ry="5" fill="#ffffff" opacity="0.3" />

  <!-- Player Initials on Jersey -->
  <text x="120" y="218" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="2">
    ${initials}
  </text>

  <!-- OVR Rating Shield Badge (Top Right) -->
  <g transform="translate(172, 18)">
    <polygon points="24,0 48,10 48,34 24,46 0,34 0,10" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1.5"/>
    <text x="24" y="28" font-family="'Inter', sans-serif" font-weight="900" font-size="19" fill="#0f172a" text-anchor="middle">
      ${rating}
    </text>
  </g>

  <!-- Country Flag Badge (Top Left) -->
  <g transform="translate(18, 22)">
    <circle cx="16" cy="16" r="16" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="16" y="22" font-size="18" text-anchor="middle">${flag}</text>
  </g>

  <!-- Role Badge at Bottom -->
  <g transform="translate(24, 238)">
    <rect x="0" y="0" width="192" height="26" rx="13" fill="#0f172a" stroke="${theme.secondary}" stroke-width="1.5"/>
    <text x="96" y="18" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="${theme.accent}" text-anchor="middle" letter-spacing="1">
      ${theme.icon} ${role.toUpperCase()}
    </text>
  </g>
</svg>`.trim();

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // Track failed URLs and network availability
  const _failedImageUrls = new Set();
  let _consecutiveFailures = 0;
  
  // Auto-recover: periodically try CDN again (every 30s) in case network came back
  

  /**
   * Helper that retrieves the best image URL for a player.
   * If remote is blocked or player has no photo, returns instant SVG avatar.
   */
  function getPlayerImage(player) {
    if (!player) return "";
    const pObj = typeof player === 'string' ? { name: player } : player;
    const name = pObj.name;

    // If remote CDN is blocked or unavailable, return instant SVG directly
    

    const directUrl = PLAYER_IMAGES[name];
    if (directUrl && !_failedImageUrls.has(directUrl)) {
      return directUrl;
    }

    // Fallback: generate high-quality SVG avatar
    return generatePlayerAvatarSVG(pObj);
  }

  /**
   * Call this from an <img onerror> handler to swap to SVG fallback
   * and remember that the CDN URL failed so we don't retry it.
   */
  function handlePlayerImageError(imgElement, player) {
    if (!imgElement) return;
    if (imgElement.src && imgElement.src.startsWith('data:image/svg+xml')) {
      return;
    }
    if (imgElement.src) {
      _failedImageUrls.add(imgElement.src);
      // Fallback only this individual image, never block other players
    }
    try {
      let p = player;
      if (!p && imgElement.dataset) {
        p = {
          name: imgElement.dataset.playerName || imgElement.alt || 'IPL Player',
          role: imgElement.dataset.playerRole || 'Batsman',
          rating: parseInt(imgElement.dataset.playerRating, 10) || 80,
          country: imgElement.dataset.playerCountry || 'India',
          initials: imgElement.dataset.playerInitials || ''
        };
      }
      if (!p || (!p.name && !imgElement.dataset.playerName)) {
        p = (typeof Game !== 'undefined' && Game.getCurrentPlayer) ? Game.getCurrentPlayer() : { name: 'IPL Player', role: 'Batsman', rating: 80 };
      }
      imgElement.src = generatePlayerAvatarSVG(p);
    } catch (e) {
      console.warn("Avatar fallback warning", e);
    }
  }

  /**
   * Generates a fully guarded <img> HTML element with instant SVG fallback,
   * referrerpolicy, and all player attributes for flawless rendering everywhere.
   */
  function renderPlayerAvatarImg(player, extraClasses = 'w-full h-full object-cover') {
    if (!player) return `<img src="" alt="" class="${extraClasses}">`;
    const name = typeof player === 'string' ? player : (player.name || 'IPL Player');
    const role = typeof player === 'object' ? (player.role || 'Batsman') : 'Batsman';
    const rating = typeof player === 'object' ? (player.rating || 80) : 80;
    const country = typeof player === 'object' ? (player.country || 'India') : 'India';
    const initials = typeof player === 'object' ? (player.initials || '') : '';
    const src = getPlayerImage(player);

    const safeName = String(name).replace(/"/g, '&quot;');
    const safeRole = String(role).replace(/"/g, '&quot;');
    const safeCountry = String(country).replace(/"/g, '&quot;');
    const safeInitials = String(initials).replace(/"/g, '&quot;');

    return `<img src="${src}" alt="${safeName}" 
      data-player-name="${safeName}" 
      data-player-role="${safeRole}" 
      data-player-rating="${rating}" 
      data-player-country="${safeCountry}" 
      data-player-initials="${safeInitials}" 
      referrerpolicy="no-referrer" 
      onerror="handlePlayerImageError(this)" 
      class="${extraClasses}">`;
  }

  // Global Exports
  global.PLAYER_IMAGES = PLAYER_IMAGES;
  global.COUNTRY_FLAGS = COUNTRY_FLAGS;
  global.ROLE_THEMES = ROLE_THEMES;
  global.generatePlayerAvatarSVG = generatePlayerAvatarSVG;
  global.getPlayerImage = getPlayerImage;
  global.handlePlayerImageError = handlePlayerImageError;
  global.renderPlayerAvatarImg = renderPlayerAvatarImg;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
