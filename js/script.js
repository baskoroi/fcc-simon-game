{
    "use strict";

    /**
     * colors for the HTML elements
     * (except the RGBY - red, green, blue, and yellow buttons)
     */
    let colors = {
        light: {
            off: "#692b2b",
            on: "#d63b3b",
        },
        piece: {
            on: "#5ab7f4",
        },
        play: [
            // green button
            {
                on: "#2ecc71",
                off: "#27ae60",
            },

            // red button
            {
                on: "#e9594a",
                off: "#c0392b",
            },

            // yellow button
            {
                on: "#fff600",
                off: "#e5db20",
            },

            // blue button
            {
                on: "#3498db",
                off: "#2980b9",
            },
        ],
    };

    /**
     * The notes to play per RGBY button (and an error SFX)
     * @type {Array}
     */
    let notes = [
        // for RGBY buttons
        new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),

        // error sound
        new Audio("http://res.cloudinary.com/baskoroi/video/upload/v1471519887/Beep_025sec_dc9fs1.mp3"),
    ];

    /**
     * Colors enum to fill sequence[] (see sequence[] in Status() constructor)
     * @type {Object}
     */
    let Quarter = {
        green: 0,
        red: 1,
        yellow: 2,
        blue: 3,
        random() {
            return Math.floor(Math.random() * 4);
        },
    };

    /**
     * Stores the current timer ID (to clear when Simon is off)
     */
    let timerID;

    /**
     * Stores and manipulates status of the game (i.e. power on/off, strict mode, win)
     */
    function Status() {
        // sequence of RGBY buttons to press
        this.sequence = [];
        this.currentIndex = 0;

        // status variables
        this.power = false;
        this.strict = false;
        this.win = false;
    }
    
    Status.prototype = {
        constructor: Status,
        
        appendSequence: function(val) { this.sequence.push(val); },
        getSequence: function() { return this.sequence; },
        resetSequence: function() { this.sequence.length = 0; },
        
        getCurrentIndex: function() { return this.currentIndex; },
        incrementIndex: function() { this.currentIndex++; },
        setCurrentIndex: function(index) { this.currentIndex = index; },

        getPower: function() { return this.power; },
        getStrict: function() { return this.strict; },
        getWin: function() { return this.win; },

        setPower: function(power) { this.power = power; },
        setStrict: function(strict) { this.strict = strict; },
        setWin: function(win) { this.win = win; },

        switchPower: function() { this.power = !this.power; },
        switchStrict: function() { this.strict = !this.strict; },
        switchWin: function() { this.win = !this.win; },
    };

    /**
     * Stores and manipulates HTML elements and their behavior in the game
     */
    function Simon() {
        // Status object (controls power, start of game, and strict mode)
        this.status = new Status();

        // HTML elements
        this.countScreen = document.getElementsByClassName("count")[0];
        this.startBtn    = document.getElementsByClassName("start")[0];
        this.strictLight = document.getElementsByClassName("light")[0];
        this.strictBtn   = document.getElementsByClassName("strict")[0];
        this.onOffBtn    = document.getElementsByClassName("switch")[0];
        this.piece       = document.getElementsByClassName("piece");

        // the large RGBY buttons
        this.playButtons = document.getElementsByClassName("play-button");
        this.greenBtn  = this.playButtons[0];
        this.redBtn    = this.playButtons[1];
        this.yellowBtn = this.playButtons[2];
        this.blueBtn   = this.playButtons[3];

        this.blinkScreen = () => {
            let i = 0;
            let intervalID;
            timerID = intervalID = window.setInterval(() => {
                this.countScreen.setAttribute("value", "--");
                if (i % 2 === 0) {
                    this.countScreen.style.color = colors.light.off;
                } else {
                    this.countScreen.style.color = colors.light.on;
                }
                if (++i === 4) {
                    window.clearInterval(intervalID);
                }
            }, 250);
        };

        this.changeCursor = (event) => {
            event.target.style.cursor = "pointer";
        };

        this.turnOnGreenBackground = (event) => {
            event.target.style.backgroundColor = colors.play[0].on;
        };

        this.turnOnRedBackground = (event) => {
            event.target.style.backgroundColor = colors.play[1].on;
        };

        this.turnOnYellowBackground = (event) => {
            event.target.style.backgroundColor = colors.play[2].on;
        };

        this.turnOnBlueBackground = (event) => {
            event.target.style.backgroundColor = colors.play[3].on;
        };

        this.turnOffGreenBackground = (event) => {
            event.target.style.backgroundColor = colors.play[0].off;
        };

        this.turnOffRedBackground = (event) => {
            event.target.style.backgroundColor = colors.play[1].off;
        };

        this.turnOffYellowBackground = (event) => {
            event.target.style.backgroundColor = colors.play[2].off;
        };

        this.turnOffBlueBackground = (event) => {
            event.target.style.backgroundColor = colors.play[3].off;
        };

        // click handler for each button
        this.greenClickHandler = () => {         
            if (this.status.getPower()) {
                if (this.status.getSequence()[this.status.getCurrentIndex()] === 0) { // correct
                    // play sound (based on index)
                    notes[0].play();

                    // increment current index
                    this.status.incrementIndex();
                    if (this.status.getCurrentIndex() === 
                        this.status.getSequence().length) {

                        this.status.setCurrentIndex(0);
                        timerID = window.setTimeout(this.startLevel, 1000, true);
                    }
                } else { // incorrect
                    // play error sound
                    notes[4].play();

                    this.blinkScreen();
                    timerID = window.setTimeout(this.startLevel, 1500, false);
                }
            }
        };

        this.redClickHandler = () => {
            if (this.status.getPower()) {
                if (this.status.getSequence()[this.status.getCurrentIndex()] === 1) { // correct
                    // play sound (based on index)
                    notes[1].play();

                    // increment current index
                    this.status.incrementIndex();
                    if (this.status.getCurrentIndex() === 
                        this.status.getSequence().length) {
                        
                        this.status.setCurrentIndex(0);
                        timerID = window.setTimeout(this.startLevel, 1000, true);
                    }
                } else { // incorrect
                    // play error sound
                    notes[4].play();

                    this.blinkScreen();
                    timerID = window.setTimeout(this.startLevel, 1500, false);
                }
            }
        };
        this.yellowClickHandler = () => {            
            if (this.status.getPower()) {
                if (this.status.getSequence()[this.status.getCurrentIndex()] === 2) { // correct
                    // play sound (based on index)
                    notes[2].play();

                    // increment current index
                    this.status.incrementIndex();
                    if (this.status.getCurrentIndex() === 
                        this.status.getSequence().length) {
                        
                        this.status.setCurrentIndex(0);
                        timerID = window.setTimeout(this.startLevel, 1000, true);
                    }
                } else { // incorrect
                    // play error sound
                    notes[4].play();

                    this.blinkScreen();
                    timerID = window.setTimeout(this.startLevel, 1500, false);
                }
            }
        };
        this.blueClickHandler = () => {            
            if (this.status.getPower()) {
                if (this.status.getSequence()[this.status.getCurrentIndex()] === 3) { // correct
                    // play sound (based on index)
                    notes[3].play();

                    // increment current index
                    this.status.incrementIndex();
                    if (this.status.getCurrentIndex() === 
                        this.status.getSequence().length) {
                        
                        this.status.setCurrentIndex(0);
                        timerID = window.setTimeout(this.startLevel, 1000, true);
                    }
                } else { // incorrect
                    // play error sound
                    notes[4].play();

                    this.blinkScreen();
                    timerID = window.setTimeout(this.startLevel, 1500, false);
                    
                }
            }
        };

        /**
         * Play notes, based on the generated sequence
         */
        this.playNotes = () => {
            // disable events and click listeners
            this.greenBtn.style.pointerEvents = "none";
            this.redBtn.style.pointerEvents = "none";
            this.yellowBtn.style.pointerEvents = "none";
            this.blueBtn.style.pointerEvents = "none";

            this.greenBtn.removeEventListener("click", this.greenClickHandler);
            this.redBtn.removeEventListener("click", this.redClickHandler);
            this.yellowBtn.removeEventListener("click", this.yellowClickHandler);
            this.blueBtn.removeEventListener("click", this.blueClickHandler);

            this.greenBtn.removeEventListener("mousedown", this.turnOnGreenBackground);
            this.redBtn.removeEventListener("mousedown", this.turnOnRedBackground);
            this.yellowBtn.removeEventListener("mousedown", this.turnOnYellowBackground);
            this.blueBtn.removeEventListener("mousedown", this.turnOnBlueBackground);

            this.greenBtn.removeEventListener("mouseup", this.turnOffGreenBackground);
            this.redBtn.removeEventListener("mouseup", this.turnOffRedBackground);
            this.yellowBtn.removeEventListener("mouseup", this.turnOffYellowBackground);
            this.blueBtn.removeEventListener("mouseup", this.turnOffBlueBackground);

            // disable hover effects
            for (let i = 0; i < this.playButtons.length; i++) {
                this.playButtons[i].removeEventListener("mouseover", this.changeCursor);
            }

            // play note by note
            let duration = 0;
            this.status.getSequence().map((note) => {
                timerID = window.setTimeout(() => {
                    notes[note].play();
                    this.playButtons[note].style.backgroundColor = 
                        colors.play[note].on;
                }, duration += 800);
                
                timerID = window.setTimeout(() => {
                    this.playButtons[note].style.backgroundColor = 
                        colors.play[note].off;
                }, duration += 200);
                
            });
        };

        /**
         * Guess which notes correspond to the sequence
         * NOTE: this function must be wrapped in window.setTimeout();
         * the duration is this.status.getSequence().length * 1000
         */
        this.guessNotes = () => {
            // enable click listeners, and process player's clicks 
            // in those listeners
            this.greenBtn.addEventListener("click", this.greenClickHandler);
            this.redBtn.addEventListener("click", this.redClickHandler);
            this.yellowBtn.addEventListener("click", this.yellowClickHandler);
            this.blueBtn.addEventListener("click", this.blueClickHandler);

            this.greenBtn.addEventListener("mousedown", this.turnOnGreenBackground);
            this.redBtn.addEventListener("mousedown", this.turnOnRedBackground);
            this.yellowBtn.addEventListener("mousedown", this.turnOnYellowBackground);
            this.blueBtn.addEventListener("mousedown", this.turnOnBlueBackground);

            this.greenBtn.addEventListener("mouseup", this.turnOffGreenBackground);
            this.redBtn.addEventListener("mouseup", this.turnOffRedBackground);
            this.yellowBtn.addEventListener("mouseup", this.turnOffYellowBackground);
            this.blueBtn.addEventListener("mouseup", this.turnOffBlueBackground);

            for (let i = 0; i < this.playButtons.length; i++) {
                this.playButtons[i].addEventListener("mouseover", this.changeCursor);
            }

            this.greenBtn.style.pointerEvents = "auto";
            this.redBtn.style.pointerEvents = "auto";
            this.yellowBtn.style.pointerEvents = "auto";
            this.blueBtn.style.pointerEvents = "auto";
        };

        this.playLevel = () => {
            this.countScreen.setAttribute("value", 
                ((this.status.getSequence().length < 10) ? "0" : "") + 
                    this.status.getSequence().length.toString());

            console.log(this.status.getSequence());

            this.playNotes();
            timerID = window.setTimeout(this.guessNotes, this.status.getSequence().length * 1000);
            
        };

        // functions to initialize game
        this.startLevel = (nextLevel) => {
            if (nextLevel) {
                if (this.status.getSequence().length === 20) {
                    this.status.switchWin();
                    alert("YOU WON! Let's play again!");
                    if (this.status.getWin()) {
                        this.status.setWin(false); // reset win for a new game
                        this.status.resetSequence();
                        this.status.appendSequence(Quarter.random());
                    }
                }
                else {
                    this.status.appendSequence(Quarter.random());
                }
            } else if (!nextLevel && this.status.getStrict()) {
                this.status.resetSequence();
                this.status.appendSequence(Quarter.random());
            }
            this.playLevel();
        };

        // initialize listeners for each element
        this.onOffBtn.addEventListener("click", () => {
            this.status.switchPower();
            if (this.status.getPower()) {
                this.piece[0].style.backgroundColor = "inherit";
                this.piece[1].style.backgroundColor = colors.piece.on;
                this.countScreen.style.color = colors.light.on;
            } else {
                // disable click listeners
                for (let i = 0; i < this.playButtons.length; i++) {
                    this.playButtons[i].style.pointerEvents = "none";
                    this.playButtons[i].removeEventListener("mouseover", this.changeCursor);
                }

                this.greenBtn.removeEventListener("click", this.greenClickHandler);
                this.redBtn.removeEventListener("click", this.redClickHandler);
                this.yellowBtn.removeEventListener("click", this.yellowClickHandler);
                this.blueBtn.removeEventListener("click", this.blueClickHandler);

                this.greenBtn.removeEventListener("mousedown", this.turnOnGreenBackground);
                this.redBtn.removeEventListener("mousedown", this.turnOnRedBackground);
                this.yellowBtn.removeEventListener("mousedown", this.turnOnYellowBackground);
                this.blueBtn.removeEventListener("mousedown", this.turnOnBlueBackground);

                this.greenBtn.removeEventListener("mouseup", this.turnOffGreenBackground);
                this.redBtn.removeEventListener("mouseup", this.turnOffRedBackground);
                this.yellowBtn.removeEventListener("mouseup", this.turnOffYellowBackground);
                this.blueBtn.removeEventListener("mouseup", this.turnOffBlueBackground);

                for (let i = 0; i < this.playButtons.length; i++) {
                    this.playButtons[i].style.backgroundColor = colors.play[i].off;
                }

                if (this.status.getStrict()) {
                    this.status.switchStrict();
                    this.strictLight.style.backgroundColor = colors.light.off;
                }

                notes.map((note) => {
                    note.pause();
                    note.currentTime = 0;
                });

                while (timerID--) {
                    window.clearTimeout(timerID);
                    window.clearInterval(timerID);
                }

                this.piece[0].style.backgroundColor = colors.piece.on;
                this.piece[1].style.backgroundColor = "inherit";
                this.countScreen.setAttribute("value", "--");
                this.countScreen.style.color = colors.light.off;
            }
        });

        // start button
        this.startBtn.addEventListener("click", () => {
            if (this.status.getPower()) {
                // if the previous game has remaining elements in sequence[],
                // remove them
                if (this.status.getSequence().length > 0) {
                    this.status.resetSequence();
                }

                this.blinkScreen();
                timerID = window.setTimeout(this.startLevel, 1500, true);
                
            }
        });

        // strict mode button
        this.strictBtn.addEventListener("click", () => {
            if (this.status.getPower()) {
                this.status.switchStrict();
                if (this.status.getStrict()) {
                    this.strictLight.style.backgroundColor = colors.light.on;
                } else {
                    this.strictLight.style.backgroundColor = colors.light.off;
                }
            } else {
                console.log("NOT ON YET!");
            }
        });
    }

    let simon = new Simon();
}