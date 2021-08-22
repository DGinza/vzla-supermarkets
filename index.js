// dependencies
const fetch = require('node-fetch')
const fs = require('fs')
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const TIME = 8.64e+7 // 24 hours
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)



async function scraping() {

    const data = await fetch('https://s3.amazonaws.com/dolartoday/data.json')
    const dolar = await data.json()
    const superMarkets = fs.readdirSync('./supermarkets').filter(file => file.endsWith('.js'))
                         .map( file => require(`./supermarkets/${file}`) ) 


    for(const superMarket of superMarkets) {

        const products = await superMarket(dolar.USD.promedio_real)

        const { data, error } =  await supabase
            .from('products')
            .upsert(products)

        console.log(error ? error : Data)
    }
}

scraping()

//setInterval( scraping(), TIME)