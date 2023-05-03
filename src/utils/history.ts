// similar to a browser history but supports to any type
export default class HistoryStack<Type> {
    history: Type[];
    future: Type[];

    constructor() {
        this.history = [];
        this.future = [];
    }

    undo = () => {
        if(!this.historyEmpty()){
            this.future.push(this.history[0]);
            return this.history.pop();
        }
    }

    redo = () => {
        if(!this.futureEmpty()){
            this.history.push(this.future[0]);
            return this.future.pop();
        }
    }

    push = (item: Type) => {
        this.history.push(item);
        this.future = []; // we cant access the future anymore if we modifying right now
    }

    historyPush = (item: Type) => {
        this.history.push(item);
    }

    futurePush = (item: Type) => {
        this.future.push(item);
    }

    historyTop = () => {
        return this.history[0];
    }

    futureTop = () => {
        return this.future[0];
    }

    historyEmpty = () => {
        return this.history.length === 0;
    }

    futureEmpty = () => {
        return this.future.length === 0;
    }

    clearAll = () => {
        this.history = [];
        this.future = [];
    }
}