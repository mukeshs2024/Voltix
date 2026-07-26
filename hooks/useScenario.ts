import { useState, useEffect } from 'react';
import { scenarioStore } from '@/store/scenarioStore';
import { ScenarioType } from '@/types/dashboard';

export function useScenario() {
  const [selectedScenario, setSelectedScenarioState] = useState<ScenarioType>(
    scenarioStore.selectedScenario
  );

  useEffect(() => {
    const unsubscribe = scenarioStore.subscribe(() => {
      setSelectedScenarioState(scenarioStore.selectedScenario);
    });
    return unsubscribe;
  }, []);

  const setScenario = (scenario: ScenarioType) => {
    scenarioStore.selectedScenario = scenario;
  };

  return {
    selectedScenario,
    setScenario,
  };
}
