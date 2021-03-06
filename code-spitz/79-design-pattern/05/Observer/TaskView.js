// Decorator

export const TaskView = class {
	set(taskView) {
		this._taskView = taskView;
		return this;
	}
	task(parentTask, task) {
		this.result = this._taskView ? this._taskView.task(parentTask, task) : task._title;
		return this._task(parentTask, task);
	}
	_task(parentTask, task) { throw "override!" }
}

TaskView.base = new (class extends TaskView {
	addObserver(v) {
		this.observer = v;
	}
	notify(msg) {
		this.observer && this.observer.observe(msg);
	}
	_task(parent, task) {
		return this.result;
	}
})

export const Priority = class extends TaskView {
	_task(parentTask, task) {
		return this.result.replace(
			/\[(urgent|high|normal|low)\]/gi, '<span class="$1">$1</span>'
		);
	}
};

export const Member = class extends TaskView {
	constructor(...members) {
		super();
		this._reg = new RegExp(`@(${members.join('|')})`, 'g');
	}
	_task(parentTask, task) {
		return this.result.replace(
			this._reg, '<a href="member/$1">$1</a>'
		)
	}
}

export const Remove = class extends TaskView {
	_task(parent, task) {
		const id = Remove.id++;
		Remove[id] = () => {
			delete Remove[id];
			parent.remove(task);
			this.notify('RE_RENDER');
		}
		return this.result + `<a onclick="Remove[${id}]()">X</a>`;
	}
}
