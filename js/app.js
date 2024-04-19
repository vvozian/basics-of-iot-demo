import auth from "./common/auth.js";
import mqtt from 'https://unpkg.com/mqtt@5.5.0/dist/mqtt.esm'

if (!auth.checkOwnCredentials()) window.location.href = '/login.html';

document.getElementById('submit-order-button').setAttribute('disabled', 'disabled');

const client = mqtt.connect("wss://broker.emqx.io/mqtt", {
    port: 8084,
    clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
});

client.on('connect', function () {
    console.log('connected');
    client.subscribe('test_1', function (err) {
        if (!err) {
            client.publish('test_1', 'Hello mqtt');
        }
    })
    client.subscribe('Centria/WarehouseOrdersQueue');
    client.subscribe('Centria/WarehouseRobotPosition');
    document.getElementById('submit-order-button').removeAttribute('disabled');
    document.getElementById('submit-order-button').addEventListener('click', function () {
        const x = document.getElementById('x').value;
        const y = document.getElementById('y').value;
        client.publish('Centria/WarehouseOrders', JSON.stringify({ x, y }));

        document.getElementById('x').value = '';
        document.getElementById('y').value = '';
    });
})
client.on('error', function (error) {
    console.log('Error:', error)
})
client.on('message', function (topic, message) {
    console.log('message', topic, message.toString());
    if (topic === 'Centria/WarehouseOrdersQueue') {
        const queue = JSON.parse(message);
        const list = document.getElementById('orders_list');
        list.innerHTML = '';

        queue.forEach((order, index) => {

            const elem = document.createElement('li');
            elem.innerHTML = `
            <span class="order-attr-title">Id: </span><span class="order-attr-value">${index + 1}</span>
            <div class="order-attr-divider"></div>
            <span class="order-attr-title">X: </span><span class="order-attr-value">${order.x}</span>
            <div class="order-attr-divider"></div>
            <span class="order-attr-title">Y: </span><span class="order-attr-value">${order.y}</span>
            `

            list.appendChild(elem);
        });
    } if (topic === 'Centria/WarehouseRobotPosition') {
        const position = JSON.parse(message);
        document.querySelector('header').innerHTML = `
        <span id="robot-position-x">
            X: ${position.x}
        </span>
        <span id="robot-position-y">
            Y: ${position.y}
        </span>`
    }
})