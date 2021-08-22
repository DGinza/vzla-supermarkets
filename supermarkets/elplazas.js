const got = require('got')
const cheerio = require('cheerio')
const Product = require('./functions/classProduct.js')


module.exports = async function elplazas(dolar) {

	let products = []
	let i = 1
	let bool = true // Temporal name while i'm thinking a better name

	while(bool === true) {

		let productName = []
		let prices = []

		try {

			const response = await got(`https://www.elplazas.com/Products.php?Page=${i}`)
			const $ = cheerio.load(response.body)


			$('.Description').each((i, product) => {
				productName.push($(product).text().trim())
			})

			/* La clase .Price tiene 2 hijos (div.Moneda, <p>) con texto que complica la extración de precios,
			   asi que las remuevo antes de extraer los precios */

			$('.Moneda').remove()
			$('.Price').children('p').remove()

			$('.Price').each((i, product) => {
				prices.push($(product).text().trim().replace(/,/g, '').replace(/[(E)]/g, '') * 1)
			})

			if(productName[0] == undefined || productName == '') bool = false
			else {

				const length = productName.length

				for(let i = 0; i < length; i++) {
					products.push(new Product('ElPlazas', productName[i], prices[i], (prices[i] / dolar).toFixed(2)))
				}
				i++
			}
			console.log(products.length)
		} 
		catch(err) {}

	}
	console.log(products)
	return [...new Set(products)]
}