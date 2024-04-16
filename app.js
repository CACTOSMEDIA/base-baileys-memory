const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const QRPortalWeb = require('@bot-whatsapp/portal');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Función para determinar el saludo según la hora del día
const getGreeting = () => {
    const currentHour = new Date().getHours();
    let greeting = '';
    if (currentHour >= 6 && currentHour < 12) {
        greeting = 'Buenos días';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Buenas tardes';
    } else {
        greeting = 'Buenas noches';
    }
    return greeting;
};

const flujosOnline = addKeyword('ver')
    .addAnswer(

        '👉 *Pepsi - 1.5$* 🍔\n👉 *CocaCola - 1.5$* 🍕\n👉 *Jugos naturales - 0.5$* 🥖', { delay: 1500 },

    )

    .addAnswer('Vas a querer otra cosa?🤔 escribe 👉 *Menú*', { delay: 1500 },
        null,
    )


const flowPedido = addKeyword(['bebida']).addAnswer(
    'Ok, te mostrare los precios de las bebidas, escribe 👉 *Ver* 👀 por favor', { delay: 1500 },
    null,
    [flujosOnline]
)



const flowDelivery = addKeyword(
    ['carrera', 'calle', 'av', 'callejon', 'urb', 'pueblo', 'caserio', 'galpon', 'Carrera', 'calles', 'Calles'])
    .addAnswer(
        'Genial! ya vamos para allá en pocos minutos 🛺🏃‍♂️🚴‍♂️', { delay: 1500 },
        null,
    )

    .addAnswer('Vas a querer otra cosa?🤔 escribe 👉 *Menú*', { delay: 1500 },
        null,
    )


const flowEnvio = addKeyword(['delivery'])
    .addAnswer(
        'Perfecto! indicame por favor tu dirección 🚩 para procesar tu pedido y envio', { delay: 1500 },
        null,
        flowDelivery
    );

const flujosPagomovil = addKeyword(['pago movil', 'efectivo', 'tarjeta'])
    .addAnswer(

        'Estos son los datos del pago movil, recuerda pasar el *captur* para procesar tu pago 😊\n\n🗄18123456\n📳04121234567\n🏦Banco\n\nPara los pagos en efectivo o por punto visítanos que aquí esperamos para que realices tu pago, Estamos en 🚩: Carrera A entre B y C, Local N° 1, Edi 1, piso 1\n\nY si de lo contrario no quieres venir, tenemos *Delivery*', { delay: 1500 },
    )

    .addAnswer('Si quieres un envío escribe 👉 *delivery*', { delay: 2100 },

    )

    .addAnswer('Si quieres agregar una 🥤 escribe 👉 *bebida*', { delay: 1500 },
        null,
    )


const flowSecundario = addKeyword(['pedir']).addAnswer(
    '¿Como quieres pagar?\n 💸*Efectivo*\n 🏦*Pago movil*\n 💳*Tarjeta*', { delay: 1500 },
    null,
    [flujosPagomovil]
);

const flowArepa = addKeyword(['Arepa', 'arepa', 'arepas']).addAnswer(
    '*Vergación que molleja!* quereís probar el sazón de las *Arepas Zulianas* 🥙.\nDos arepas de maíz picadas con carne molida, huevos sancochados, queso blanco, queso amarillo, tocinetas, queso parmesano, papas fritas, y salsas a gusto.\ndisfruta del sabor auténtico de las arepas zulianas\nPrecio: *4$*',
    {
        media: 'https://i.postimg.cc/Hk7vC20b/arepa.png'
    })
    .addAnswer('¿Te gustaría comer este delicioso plato? escribe *pedir*', { delay: 1000 },
        null,
        [flowSecundario]
    );

const flowHotDog = addKeyword(['HotDog', 'hotdog']).addAnswer(
    'Brutal! has elegido *HotDog* 🌭\nSalchicha de viena a la parrilla con pan, tomate, cebolla y mostaza.\nAgrega papas fritas\nPor tan solo: *1,5$*',
    {
        media: 'https://i.postimg.cc/qRfTTqCv/hotdog.png'
    })
    .addAnswer('Para ordenar este plato escribe *pedir*', { delay: 1000 },
        null,
        [flowSecundario]
    );

const flowPepito = addKeyword(['Pepito', 'pepito']).addAnswer(
    'Uff! te gusta lo bueno.. quieres *Pepito* 🥖\nUn clásico sándwich de carne de res, jamón, queso, tomate y salsas a gusto.\nAcompáñalo con papas fritas\nPor tan solo: *4$*',
    {
        media: 'https://i.postimg.cc/VkBs4jSW/pepito.png'
    })

    .addAnswer('Para ordenar este plato escribe *pedir*', { delay: 1000 },
        null,
        [flowSecundario]
    );

const flowPizza = addKeyword(['Pizza', 'pizza']).addAnswer(
    'Perfecto! has elegido *Pizza* 🍕\nDeliciosa pizza con queso mozzarella, salsa de tomate y pepperoni.\nDisponible en tamaño mediana, grande y familiar\nprecios:\nMediada: *2$*\nGrande: *4$*\nFamiliar: *8$*',
    {
        media: 'https://i.postimg.cc/rF7R7Cw6/pizza.png'
    })

    .addAnswer('Para ordenar este plato escribe *pedir*', { delay: 1000 },
        null,
        [flowSecundario]
    );

const flowHamburguesas = addKeyword(['1', 'Hamburguesas', 'hamburguesas', 'hamburguesa']).addAnswer(
    'Genial! vas a comer *Hamburguesas* 🍔\nTraen doble carne de res con papas naturales por un precio de *5$*\n*2* Hamburguesas *+* 1 bebida',
    {
        media: 'https://i.postimg.cc/kXxNqp6N/img-hambur.png'
    })
    .addAnswer('Para ordenar este plato escribe *pedir*', { delay: 1000 },
        null,
        [flowSecundario]
    );

const flowPrincipal = addKeyword(['hola', 'menu', 'Menu', 'menú', 'Menú', 'MENU', 'MENÚ', 'buenas', 'como estás', 'buenos días',
    'buenas tardes', 'buenas noches', 'como estas', 'buenos dias'])
    .addAnswer([`${getGreeting()} Bienvenido al restaurante`])
    .addAnswer(getGreeting() === 'Buenos días' ? `El menú del día es el siguiente` : `El menú de la noche es el siguiente`, { delay: 1500 },)
    .addAnswer(
        [
            '1. 👉 *Hamburguesas* + *bebidas*🍔',
            '2. 👉 *Pizza* + *bebidas*🍕',
            '3. 👉 *Pepito* + *bebidas*🥖',
            '4. 👉 *HotDog* + *bebidas*🌭',
            '5. 👉 *Arepas Zuliana* + *bebidas*🥙'
        ],
        {
            media: 'https://i.postimg.cc/ZRqW9LJR/localcomida.png'
        }

    )



    .addAnswer('Me indicas como es tu nombre?', { capture: true }, (ctx, { fallBack }) => {
        const name = ctx.body;
        if (!name) {
            return fallBack('🛑 Dime tu nombre antes de elegir un número.');
        }
        const regex = /^[a-zA-Z\s]+$/;
        if (!regex.test(name)) {
            return fallBack('🛑 Dime tu nombre antes de elegir un número.');
        }
        const minLength = 2;
        const maxLength = 25;
        if (name.length < minLength || name.length > maxLength) {
            return fallBack('El nombre debe tener entre 3 y 25 caracteres.',);
        }
        console.log('Nombre cliente: ', name);


    })


    .addAnswer('Ok 👉 escribe el nombre del plato o elige el *número* que más te gusta', { delay: 1500 },
        null,
        [flowArepa, flowHotDog, flowPepito, flowPizza, flowHamburguesas]

    )

const flowNumero = addKeyword(['6', '7', '8', '9', '0', '10', '11'])
    .addAnswer('El número que ingresaste no es correcto, intentalo de nuevo',
        null,
        [flowArepa, flowHotDog, flowPepito, flowPizza, flowHamburguesas]
    )


// .addAnswer('Ok 👉 escribe el *plato* que más te gusta',
//   null,
//      [flowPizza, flowPepito, flowHotDog, flowArepa, flowHamburguesas]
//   );

const flowAdios = addKeyword(['gracias', 'muchas gracias', 'graciasgracias', 'no', 'no quiero', 'asi esta bien', 'ok'])
    .addAnswer('Vale! siempre a la orden! 😊', { delay: 1500 },);


const mainBOTCOMIDA = async () => {

    const BOTCOMIDA = 'botcomida'

    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, flowSecundario, flowHamburguesas, flowPizza, flowPepito, flowHotDog, flowArepa,
        flujosPagomovil, flowEnvio, , flowDelivery, flujosOnline, flowPedido, flowNumero, flowAdios]);
    const adapterProvider = createProvider(BaileysProvider, {
        name: BOTCOMIDA
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb({ name: BOTCOMIDA, port: 2210 });
};

mainBOTCOMIDA();
