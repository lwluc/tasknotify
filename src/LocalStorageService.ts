import { Memento } from 'vscode';

export class LocalStorageService {
    
    constructor(private storage: Memento) { }   
    
    public getValue<T>(key : string) : T | null {
        return this.storage.get<T | null>(key, null);
    }

    public setValue<T>(key : string, value : T) {
        this.storage.update(key, value);
    }
}