import { Opportunity } from '../types';
import { generateComprehensiveOpportunities } from './opportunityGenerator';

export const initialOpportunities: Opportunity[] = generateComprehensiveOpportunities(35000);
