window.onload = function() {
	// display dropdownlist
    var dropdown = document.getElementById("selDataset");
	dropdown.innerHTML = "";
	for (var i = 0; i < data.names.length; i++){
		var op = document.createElement("option"); 
		op.value = data.names[i];
		op.text = data.names[i];
		dropdown.appendChild(op);
	}
	optionChanged(data.names[0]);
};

function optionChanged(e){
	// seatch sample & metadata
	var sample = {};
	var metadata = {};
	for(var i = 0; i < data.samples.length; i++) {
		if (data.samples[i].id == e) {
			sample = data.samples[i];
		}
		if (data.metadata[i].id == e) {
			metadata = data.metadata[i];
		}
	}
		
	displayMetadata(metadata);
	
	// get top 10 for barChart
	var barChartData = [];
	for(var i = 0; i < 10; i++) {
		barChartData.push({
			"name": "OTU " + sample.otu_ids[i],
			"value": sample.sample_values[i],
			"label": sample.otu_labels[i]
        });
	}
	
	buildBarChart(barChartData);
}

function displayMetadata(data){
	var info = document.getElementById("sample-metadata");
	info.innerHTML = "";
	var lb = document.createElement("p"); 
	lb.innerHTML = "id: " + data.id;
	info.appendChild(lb);
	lb = document.createElement("p"); 
	lb.innerHTML = "ethnicity: " + data.ethnicity;
	info.appendChild(lb);
	lb = document.createElement("p"); 
	lb.innerHTML = "gender: " + data.gender;
	info.appendChild(lb);
	lb = document.createElement("p"); 
	lb.innerHTML = "age: " + data.age;
	info.appendChild(lb);
	lb = document.createElement("p"); 
	lb.innerHTML = "location: " + data.location;
	info.appendChild(lb);
	lb = document.createElement("p"); 
	lb.innerHTML = "bbtype: " + data.bbtype;
	info.appendChild(lb);
	lb = document.createElement("p"); 
	lb.innerHTML = "wfreq: " + data.wfreq;
	info.appendChild(lb);	
}

function buildBarChart(data) {
	var bar = document.getElementById("bar");
	bar.innerHTML = "";
	
	var width = 300;
	var height = 400;
	
	data = data.sort(function(a, b) { return a.value - b.value; });
  
	var svg = d3.select("#bar")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate(0,0)");
    
    margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;
	
	var chart = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  	var x = d3.scaleLinear().range([0, width*0.95]).domain([0, d3.max(data, function(d) { return d.value; })]);
    var y = d3.scaleBand().range([height, 0]).domain(data.map(function(d) { return d.name; })).padding(0.1);

    chart.append("g")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(5)
        .tickFormat(function(d) { return (d); })
        .tickSizeInner([-height]));

    chart.append("g").call(d3.axisLeft(y));
		
	// tooltip
	var tooltip = d3.select("#bar")
	.append("div")
	.style("position", "absolute")
	.style("z-index", 10)
	.style("visibility", "hidden")
	.text("");

    chart.selectAll(".bar")
        .data(data)
		.enter()
		.append("rect")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return x(d.value); })
		.attr("fill", "#0380fc")
		.text(d => d.label)
			.on("mouseover", d => {tooltip.text(d.label); return tooltip.style("visibility", "visible")})
			.on("mouseout", () => tooltip.style("visibility", "hidden"))
}

function buildBubbleChart(data) {
}

/*
{"id": "940", 
"otu_ids": [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977, 3450, 874, 1959, 2191, 1950, 2077, 2275, 944, 2184, 2244, 2024, 2419, 2811, 165, 2782, 2247, 2011, 2396, 830, 2964, 1795, 2722, 307, 2178, 2908, 1193, 2167, 1208, 2039, 1274, 2739, 2737, 1314, 1962, 2186, 2335, 2936, 907, 833, 2483, 2475, 2491, 2291, 159, 2571, 2350, 2342, 2546, 725, 170, 1505, 513, 259, 1169, 258, 1232, 1497, 1498, 1503, 412, 2235, 1960, 1968, 121, 2065, 340, 2110, 2188, 357, 342], 
"sample_values": [163, 126, 113, 78, 71, 51, 50, 47, 40, 40, 37, 36, 30, 28, 25, 23, 22, 19, 19, 14, 13, 13, 13, 12, 12, 11, 11, 11, 10, 10, 10, 8, 7, 7, 7, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], 
"otu_labels": ["Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Peptoniphilus", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Proteobacteria;Epsilonproteobacteria;Campylobacterales;Campylobacteraceae;Campylobacter", "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales;Actinomycetaceae;Varibaculum", "Bacteria;Firmicutes;Clostridia", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria;Firmicutes;Clostridia", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales;Corynebacteriaceae;Corynebacterium", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Peptoniphilus", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Peptoniphilus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales", "Bacteria;Firmicutes;Clostridia;Clostridiales;Veillonellaceae", "Bacteria;Firmicutes;Bacilli;Bacillales;Staphylococcaceae;Staphylococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Finegoldia", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Firmicutes;Clostridia;Clostridiales;Peptococcaceae;Peptococcus", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Prevotellaceae", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Gallicola", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Gallicola", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Prevotellaceae;Prevotella", "Bacteria;Firmicutes;Clostridia", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae", "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales;Corynebacteriaceae", "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales;Actinomycetaceae", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus", "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales", "Bacteria", "Bacteria;Firmicutes", "Bacteria", "Bacteria", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria", "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Porphyromonas", "Bacteria;Firmicutes", "Bacteria;Firmicutes", "Bacteria;Firmicutes", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria;Firmicutes;Clostridia", "Bacteria;Firmicutes;Clostridia", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria", "Bacteria;Firmicutes;Clostridia;Clostridiales", "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI", "Bacteria", "Bacteria"]}
*/

