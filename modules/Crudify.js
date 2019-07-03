const util = require('util')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const beautify = require('js-beautify').js

let dirGenerate = 'zmodel/'


const BEAUTIFY_CONFIG = {
	'indent_size': '2',
	'indent_char': '	',
	'max_preserve_newlines': '5',
	'preserve_newlines': true,
	'keep_array_indentation': false,
	'break_chained_methods': false,
	'indent_scripts': 'normal',
	'brace_style': 'collapse',
	'space_before_conditional': true,
	'unescape_strings': false,
	'jslint_happy': false,
	'end_with_newline': false,
	'wrap_line_length': '0',
	'indent_inner_html': false,
	'comma_first': false,
	'e4x': false,
	'indent_empty_lines': false
}

function clone(obj) {
	return Object.assign({}, obj)
}

function createProperty(obj, property, defaultValue) {
	if(!obj[property]) {
		obj[property] = defaultValue
		return obj[property]
	}
	return obj[property]
}

function createBaseModel() {
	return {
		tableName: null,
		modelName: null,
		fileName: null,
		fields: {}
	}
}

async function generateModelFrontend(dir) {
	let directory = path.resolve(dir || './models')
	const models = require(directory)
	let resultModel = {}
	for(let nameModel in models) {
		let cloneModel = clone(models[nameModel])
		if(cloneModel.tableAttributes) {
			let curModel = createProperty(resultModel, nameModel, createBaseModel())
			curModel.tableName = cloneModel.tableName
			curModel.fileName = nameModel
			for(let keyField in cloneModel.tableAttributes) {
				let field = clone(cloneModel.rawAttributes[keyField])
				let modelName = field.Model.options.name.singular
				if(!curModel.modelName) {
					curModel.modelName = modelName
				}
				field.type = field.type.key
				field.Model = util.inspect(field.Model)
				field.Model = modelName
				delete field.validate
				curModel.fields[keyField] = clone(field)
			}
		}
	}

	if (!fs.existsSync(dirGenerate)){
		fs.mkdirSync(dirGenerate);
	}

	let datafile = fs.readFileSync([__dirname, 'template-model.jsp'].join('/'), 'utf-8')
	let compiled = _.template(datafile)
	for(let key in resultModel) {

		let parseData = beautify(util.inspect(resultModel[key], {showHidden: true, depth: null}), BEAUTIFY_CONFIG)
		let data = compiled({ data: parseData, models: [] })
		fs.writeFileSync(`${dirGenerate}${key}.js`, data)
	}
	fs.writeFileSync(`${dirGenerate}index.js`, compiled({models: Object.entries(resultModel), data: `{ ${Object.keys(resultModel).join(', ')} }`}))

	try {
		models.sequelize
			.authenticate()
			.then(async () => {
				await models.sequelize.close()
			})
			.catch(err => {
				console.error('Unable to connect to the database:', err);
			});
	} catch (e) {
		console.log(e)
	}
}


module.exports = {
	generateModelFrontend
}
