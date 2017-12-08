#!/usr/bin/env node

const fs = require('fs');
const config = require('../src/config');
const MARKER_START = '<!-- config-docs-start -->';
const MARKER_END = '<!-- config-docs-end -->';


function updateREADME(){
	const filename = './CLIENT.md';
	const schema = config.getSchema().properties;
	const readme = fs.readFileSync(filename, 'utf8');
	const markerPtn = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, 'gmi');
	const docs = `${MARKER_START}\n${buildDocs(schema, getHeader())}\n${MARKER_END}`;
	fs.writeFileSync(filename, readme.replace(markerPtn, docs));
}

function buildDocs(schema, header){
	return Object.keys(schema).reduce((info, k) => {
		const setting = schema[k];

		if (setting.env){
			return info += `\n| ${setting.env} | ${setting.doc || 'N/A'} | \`${setting.default || 'N/A'}\` |`;
		}

		if (setting.properties){
			return buildDocs(setting.properties, info);
		}

		return info;
	}, header);
}

function getHeader(){
	return [
		'| Environment Variable | Description | Default |',
		'| -------------------: | ----------- | ------- |'
	].join('\n');
}


// RUN ////////////////////////////////////////////////////////////////////////
updateREADME();
