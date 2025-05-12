window.addEventListener("load", handleLoad);
let canvas;
let crc;
let width = 1200;
let height = 1200;

let drawFlower = true;
let allFlowers = [];

let amountofTypes = 3;
let currentType = 1;
let counter = 0;
//verschiedene Blumen nach bestimmter Zeit
//Animation, wachsen und drehen
//lifespan, fade out

function handleLoad() {
    canvas = document.querySelector("canvas");
    crc = canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 1200;
    crc.fillStyle = "#a7e685";
    crc.fillRect(0, 0, width, height);

    window.setInterval(animation, 40)


    canvas.addEventListener("mousemove", (event) => {
        if (drawFlower) {
            let x = event.clientX - 30 + getRandomPoint();
            let y = event.clientY - 50 + getRandomPoint();

            currentType = Math.floor(Math.random()*3 + 1)
            let flower = new Flower(x, y, currentType);
            allFlowers.push(flower);
            drawFlower = false;

            window.setTimeout(function () {
                drawFlower = true;
            }, 45)

            counter++;

            /* if (counter >= 100) {
                counter = 0;
                currentType++;
                if (currentType > amountofTypes) {
                    currentType = 1;
                }
            } */
        }

    })
}

function animation() {
    crc.fillStyle = "#a7e685";
    crc.fillRect(0, 0, width, height)

    allFlowers.forEach((flower) => {
        flower.draw()
        flower.currentLife += 40;

        if (flower.currentLife > flower.lifetime) {
            let index = allFlowers.indexOf(flower);
            allFlowers.splice(index, 1);
        }
    })
}

function getRandomPoint() {
    let newPos = Math.random() * 30 - 15;
    return newPos;
}

class Flower {
    lifetime = 35000;
    currentLife = 0;
    flowerImg1;
    flowerImg2;
    flowerImg3;
    flowerImg4;
    state;
    rotation;
    swayAmplitude;
    swaySpeed;
    windOffset;
    bobOffset;
    bobSpeed;
    bobAmplitude;
    baseY;
    x;
    y;
    opacity = 1;

    state = 1;
    fading = false;
    fadingCounter = 1;
    fadingCounter2 = 0;

    constructor(x, y, type) {
        this.flowerImg1 = document.getElementById(type + "_1");
        this.flowerImg2 = document.getElementById(type + "_2");
        this.flowerImg3 = document.getElementById(type + "_3");
        this.flowerImg4 = document.getElementById(type + "_4");
        this.rotation = Math.random() * 2 * Math.PI;
        this.x = x;
        this.y = y;

        this.windOffset = Math.random() * 2 * Math.PI;
        this.swayAmplitude = 0.005 + Math.random() * 0.005;
        this.swaySpeed = 0.0005 + Math.random() * 0.003;


        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobAmplitude = 0.5 + Math.random() * 1;
        this.bobSpeed = 0.0004 + Math.random() * 0.005;
        this.baseY = this.y;
        this.draw();
    }

    draw() {
        const sway = Math.sin(this.currentLife * this.swaySpeed + this.windOffset) * this.swayAmplitude;
        this.rotation += sway;

        this.y = this.baseY + Math.sin(this.currentLife * this.bobSpeed + this.bobOffset) * this.bobAmplitude;

        this.setstate();
        this.fade();
        crc.save();
        crc.translate(this.x, this.y);

        if (this.state == 1 || this.state == 2) {
            crc.scale(0.5, 0.5)
        }
        else {
            crc.scale(0.3, 0.3)
        }
        crc.rotate(this.rotation);
        if (this.lifetime > 15000) {
            crc.globalAlpha = this.opacity
        }
        else {
            crc.globalAlpha = this.fadingCounter;
        }
        crc.drawImage(this.currentImg(this.state), 0, 0);

        if (this.fading) {
            crc.restore()

            crc.save()
            crc.translate(this.x, this.y);
            crc.rotate(this.rotation);
            if(this.state+1 == 3 || this.state+1 == 4) {
                crc.scale(0.3, 0.3)
            }else {
                crc.scale(0.5, 0.5)
            }
            crc.globalAlpha = this.fadingCounter2;
            crc.drawImage(this.currentImg(this.state + 1), 0, 0)
            crc.restore();
        }

        crc.globalAlpha = 1;
        crc.restore();
    }
    

    setstate() {
        if (this.currentLife >= 1500 && this.currentLife < 3500) {
            this.fading = true;
        }
        else if (this.currentLife >= 3500 && this.currentLife < 5000) {
            this.state = 2;
            this.fading = false;
            this.fadingCounter = 1;
            this.fadingCounter2 = 0;
        }
        else if (this.currentLife >= 5000 && this.currentLife < 7000) {
            this.fading = true;
        }
        else if (this.currentLife >= 7000 && this.currentLife < 8500) {
            this.state = 3;
            this.fading = false;
            this.fadingCounter = 1;
            this.fadingCounter2 = 0;
        }
        else if (this.currentLife >= 8500 && this.currentLife < 10500) {
            this.fading = true;
        }
        else if (this.currentLife >= 10500) {
            this.state = 4;
            this.fading = false;
            this.fadingCounter = 1;
            this.fadingCounter2 = 0;
        }

        if (this.fading) {
            this.fadingCounter -= 0.02;
            this.fadingCounter2 += 0.02;
        }

        console.log(this.fading, this.state)
    }

    currentImg(num) {
        switch (num) {
            case 1:
                return this.flowerImg1;
            case 2:
                return this.flowerImg2;
            case 3:
                return this.flowerImg3;
            case 4:
                return this.flowerImg4;
        }
    }

    fade() {
        if (this.currentLife < (this.lifetime - 5000)) {
            this.opacity = 1;
        }

        else if (this.currentLife >= (this.lifetime - 5000)) {
            let progress = (this.currentLife - (this.lifetime - 5000)) / 5000

            this.opacity = 1 - progress;
        }

        else {
            this.opacity = 0;
        }
    }



}