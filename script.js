//! === | Shortcuts | === //
const Q = q => document.querySelector(q);
const A = q => document.querySelectorAll(q);
const C = console.log;

//! ===== ===== | VARIABLES | ===== ===== //

var level, roundPosition, gameActive;
var currentPosition = 0;
var checkPosition = 0;
var dn = 0;
var speed = 1000;
var leng = 5;
const col = ['red', 'lime','yellow', 'blue'];

//! ===== ===== | FUNCTIONS | ===== ===== //

var createLevel = (length)=> {
    gameActive = true;
    level = [];
    roundPosition = 0;
    for(i=0;i<length;i++){
        let rand = Math.floor(Math.random()*4);
        level.push(col[rand]);
    }
}

var play = ()=> {
    if(gameActive){
        (function thisLoop (i) {
            setTimeout(function () {
                let thisDiv = Q(`#${level[i]}`);
                thisDiv.style.backgroundColor = thisDiv.id;
                beep(beepColor[thisDiv.id])
                setTimeout(()=> {
                    thisDiv.style.backgroundColor = thisDiv.dataset.color;
                },speed / 2);

                if(i<roundPosition){
                    i++;
                    thisLoop(i);
                }
            }, speed);
        })(0);
    }

};

var checkIfCorrect = (d)=> {
    if(gameActive){
        if(d.id == level[currentPosition]){
            if(currentPosition == level.length-1){
                win();
            }else if(currentPosition === roundPosition){
                roundPosition++;
                currentPosition = 0;
                play();
            }else{
                currentPosition++;
            }
        }else{
            oops();
            currentPosition = 0;
            roundPosition = 0;
        }
    };
};

var win = ()=> {
    (function winLoop (i) {
        setTimeout(function () {
            if(dn>3) dn = 0;
            let thisDiv = Q(`#${col[dn]}`);
            thisDiv.style.backgroundColor = thisDiv.id;
            setTimeout(()=> {
                thisDiv.style.backgroundColor = thisDiv.dataset.color;
                dn++;
            },200);

            if(i<20){
                i++;
                winLoop(i);
            }
        }, 150);
    })(0);
};

var oops = ()=> {
    gameActive = false;
    for(z=0;z<4;z++){
        let thisDiv = Q(`#${col[z]}`);
        thisDiv.style.backgroundColor = thisDiv.id;
    }
    setTimeout(()=> {
        for(z=0;z<4;z++){
            let thisDiv = Q(`#${col[z]}`);
            thisDiv.style.backgroundColor = thisDiv.dataset.color;
        }
    },300);
};

//! ===== ===== | SOUNDS | ===== ===== //

var context = new (window.AudioContext || window.webkitAudioContext)();

const beepColor = {
    red: 130.8,
    lime: 164.8,
    yellow: 196.0,
    blue: 261.6
}

// c=130.8   e=164.8   g=196.0   c=261.6
// var note = 130.8;

var beep = (note)=> {
    var oscillator = context.createOscillator();
    var now = context.currentTime;
    var ctx = context.createGain();
    oscillator.connect(ctx);
    ctx.connect(context.destination);
    ctx.gain.value = -.95;

    oscillator.type = 'square';
    oscillator.frequency.value = note;
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(now+0.3);
}

//! ===== ===== | EVENT LISTENERS | ===== ===== //

// @ colors
Q('#color-container').addEventListener('click', e => {
    if(e.target.matches('.color')){
        const currentBtn = e.target.closest('.color');
        currentBtn.style.backgroundColor = currentBtn.id;
        beep(beepColor[currentBtn.id]);
        setTimeout(()=> {
            currentBtn.style.backgroundColor = currentBtn.dataset.color;
            checkIfCorrect(currentBtn);
        },500)
    }
});

// @ speed button
Q('#level-speed').addEventListener('click', ()=> {
    speed -= 250;
    speed = (speed <= 0) ? 1000 : speed;
    Q('#display').innerHTML = `${speed} ms`;
    setTimeout(() => {
        Q('#display').innerHTML = '--';
    }, 500);
});

// @ length button
Q('#level-length').addEventListener('click', ()=> {
    leng += 5;
    leng = (leng > 30) ? 5 : leng;
    Q('#display').innerHTML = leng;
    setTimeout(() => {
        Q('#display').innerHTML = '--';
    }, 500);
});

// @ start button
Q('#level-start').addEventListener('click', ()=> {
    createLevel(leng);
    C(level);
    play();
});