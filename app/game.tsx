"use client";

import '@/public/globals.css';
import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js';
import { useEffect, useRef } from 'react';

export default function Game() {
    const svg = useRef<any>();
    const engine = useRef<Engine>(Engine.create());

    let player: Matter.Body;

    var colorList = [
        '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
        '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    ];

    useEffect(() => {
        const element = document.getElementById('svg');
        const ch = document.body.clientHeight;
        const cw = document.body.clientWidth;
        if (element?.children.length == 0 || true) {
            const render = Render.create({
                element: svg.current,
                engine: engine.current,
                options: {
                    width: cw,
                    height: ch,
                    wireframes: false,
                    background: 'transparent',
                }
            })
            const board = generateBoard();
            console.log(board);
            const widthOfEachSquare = cw / board[0].length;
            const heightOfEachSquare = ch / board.length;
            for (var i = 0; i < board.length; i++) {
                console.log(board[i]);
                for (var j = 0; j < board[i].length; j++) {
                    if (board[i][j] == 1) {
                        World.add(engine.current.world, [Bodies.rectangle(widthOfEachSquare * j + (widthOfEachSquare / 2), heightOfEachSquare * i + (heightOfEachSquare / 2), widthOfEachSquare, heightOfEachSquare, { isStatic: true, render: { fillStyle: colorList[Math.floor(Math.random() * colorList.length)] } })])
                    }
                }
            }
            let { x, y } = getFirstEmptySpot(board);
            addPlayer(x, y);
            document.addEventListener("keydown", (e) => handleKeyPress(e));
            Runner.run(engine.current);
            Render.run(render);
        }

    }, [])
    function handleKeyPress({ key }: KeyboardEvent) {

        let currVelocity = player.velocity;

        switch (key) {
            case "a":
                Body.setVelocity(player, { x: currVelocity.x - 0.2, y: currVelocity.y })
                break;
            case "d":
                Body.setVelocity(player, { x: currVelocity.x + 0.2, y: currVelocity.y })
                break;
        }

    }
    function getFirstEmptySpot(board: number[][]) {
        let x, y;
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] == 0) {
                    x = i;
                    y = j;
                }
            }
        }
        return { x, y }
    }
    function addPlayer(coordX: any, coordY: any) {
        let playerObject = Bodies.polygon(coordX, coordY, 10, 10, { render: { fillStyle: "#ff7f50" } });
        player = playerObject;
        World.add(engine.current.world, [playerObject]);
    }

    function getRandomNumber(a: number, b: number) {
        return Math.floor(Math.random() * (b - a) + a)
    }

    function changeSpot(innerArray: number[]) {
        let index = Math.floor(Math.random() * innerArray.length);
        let spot = innerArray[index]
        if (spot == 1) {
            return changeSpot(innerArray);
        } else {
            innerArray[index] = 1;
            return innerArray
        }
    }

    function generateBoard() {
        let board: number[][] = [];// = [Array.from({ length: 20 }, () => { return 1 })];
        for (var i = 0; i <= 20; i++) {
            let innerArray: number[] = Array.from({ length: 20 }, () => { return 0 })
            if (i % 2 == 0) {
                const closed = getRandomNumber(15, 18);
                for (var j = 0; j < closed; j++) {
                    innerArray = changeSpot(innerArray);
                }
            }
            board.push(innerArray);
        }
        return board;
    }
    return (
        <div id={'svg'} ref={svg}></div>
    )
}