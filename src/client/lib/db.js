class DB {
	constructor(){
		this._data = window.localStorage;
	}

	keys(){
		return Object.keys(this._data);
	}

	get(key){
		const json = this._data.getItem(key);
		return JSON.parse(json);
	}

	getAll(){
		return this.keys().reduce((out, k) => {
			out[k] = this.get(k);
			return out;
		}, {});
	}

	set(key, value){
		if (value != null){
			this._data.setItem(key, JSON.stringify(value));
		}
		return this;
	}

	setAll(valueMap){
		Object.keys(valueMap).forEach(k => this.set(k, valueMap[k]));
		return this;
	}

	delete(key, value){
		this._data.removeItem(key, value);
		return this;
	}

	deleteAll(){
		this.keys().forEach(k => this.delete(k));
		return this;
	}
}

export default function createDB(){
	return new DB();
}
