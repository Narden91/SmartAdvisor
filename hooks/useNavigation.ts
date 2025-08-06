import { useState, useMemo, useCallback } from 'react';
import { View } from '../types';

export const useNavigation = () => {
    const [view, setView] = useState<View>('home');

    // Memoize navigation handlers to prevent unnecessary re-renders
    const navigationHandlers = useMemo(() => ({
        toHome: () => setView('home'),
        toLoanCalculator: () => setView('loanCalculator'),
        toSalaryCalculator: () => setView('salaryCalculator'),
        toInvestmentAnalysis: () => setView('investmentAnalysis'),
    }), []);

    // Individual navigation functions for component props
    const goToHome = useCallback(() => setView('home'), []);
    const goToLoanCalculator = useCallback(() => setView('loanCalculator'), []);
    const goToSalaryCalculator = useCallback(() => setView('salaryCalculator'), []);
    const goToInvestmentAnalysis = useCallback(() => setView('investmentAnalysis'), []);

    return {
        // Current state
        currentView: view,
        
        // Navigation handlers object (for bulk operations)
        navigationHandlers,
        
        // Individual navigation functions (for component props)
        goToHome,
        goToLoanCalculator,
        goToSalaryCalculator,
        goToInvestmentAnalysis
    };
};
