import { ScenarioType } from '@/types/dashboard';

type StoreListener = () => void;

class SharedScenarioStore {
  private _selectedScenario: ScenarioType = 'cloud-cover';
  private listeners: Set<StoreListener> = new Set();

  get selectedScenario(): ScenarioType {
    return this._selectedScenario;
  }

  set selectedScenario(val: ScenarioType) {
    this._selectedScenario = val;
    this.notify();
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const scenarioStore = new SharedScenarioStore();
