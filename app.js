const encodeParams = p => Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&")

function getApp() {return {
	trades: [],
	graphs: [],
	isModalOpen: false,
	chart: null,
	series: null,
	isLoading: false,
	async getTrades() {
		this.chart = LightweightCharts.createChart(document.getElementById("chart"), {width: 600, height: 400})
		this.series = this.chart.addCandlestickSeries()
		this.series.setData([])

		let response = await fetch("https://sowatrends.ru/trades/crypto")
		this.trades = await response.json()
	},
	async showSeries(s, tf) {
		this.isLoading = true
		this.isModalOpen = true
		this.chart.removeSeries(this.series)
		let response = await fetch("https://sowatrends.ru/robots/graph?deals=crypto", {
			method: "POST",
			body: encodeParams({
				s: s,
				tf: tf,
				key: "00000907000105060106",
			}),
			headers: {
				["Content-Type"]: "application/x-www-form-urlencoded"
			}
		})
		let graphs = await response.json()
		this.series = this.chart.addCandlestickSeries()
		this.series.setData(graphs.data)

		this.isLoading = false
	},
}}