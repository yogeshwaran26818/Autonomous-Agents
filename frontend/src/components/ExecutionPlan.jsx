import React from 'react';
import { CheckCircle2, Circle, Loader2, ListTodo } from 'lucide-react';

const ExecutionPlan = ({ plan }) => {
  if (!plan || plan.length === 0) return null;

  return (
    <div className="plan-card">
      <div className="plan-header">
        <ListTodo size={18} />
        Execution Plan
      </div>
      <div className="plan-body">
        {plan.map((step, index) => (
          <div key={index} className="plan-step">
            <div className={`step-icon ${step.status.toLowerCase()}`}>
              {step.status === 'Completed' && <CheckCircle2 size={18} />}
              {step.status === 'Running' && <Loader2 size={18} />}
              {step.status === 'Pending' && <Circle size={18} />}
            </div>
            <span style={{ 
              color: step.status === 'Pending' ? 'var(--text-secondary)' : 'var(--text-primary)',
              fontWeight: step.status === 'Running' ? 500 : 400
            }}>
              {step.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionPlan;
