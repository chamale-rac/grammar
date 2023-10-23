/* eslint-disable react-refresh/only-export-components */
import { proxy } from 'valtio'

interface Image {
	src: string
	alt: string
	width: number
	height: number
	title: string
	description: string
}

interface Table {
	title: string
	head: string[]
	body: string[][]
}

interface GraphsFormProxy {
	expression: string
	images: Image[]
	tables: Table[]
}

interface SimulateFormProxy {
	expression: string
	tables: Table[]
}

export const GraphsFormProxy = proxy<GraphsFormProxy>({
	expression: '',
	images: [],
	tables: [],
})

export const SimulateFormProxy = proxy<SimulateFormProxy>({
	expression: '',
	tables: [],
})

export const interactionProxy = proxy({
	firstTimeRetrieveURL: true,
})

export const saveProxy = proxy({
	graphExpressionInput: '',
	simulateExpressionInput: '',
	simulateStringsInput: '',
})

export const neoSaveProxy = proxy({
	grammar: '',
	initialSymbol: '',
	prefix: '',
	sentence: '',
})

interface Image {
	src: string
	alt: string
	width: number
	height: number
	title: string
	description: string
}

interface responseData {
	prefix: string
	initialSymbol: string
	resultantGrammar: string
	initialGrammar: string
	sentence: string
	images: Image[]
	isIn: boolean | undefined
	took: number
}

export const WorkFormProxy = proxy<responseData>({
	prefix: '',
	initialSymbol: '',
	resultantGrammar: '',
	initialGrammar: '',
	sentence: '',
	images: [],
	isIn: undefined,
	took: 0,
})
