import React from 'react';
import './ChoosePlan.scss';

const ChoosePlan = () => {
  return (
    <div className="choose-plan">
      <h2>Choose Your Plan</h2>
      <div className="plan-buttons">
        <div className="plan">
          <h3>Basic Plan</h3>
          <p>Monitor up to 5 services.</p>
          <p>$5/month</p>
          <stripe-buy-button
            buy-button-id="buy_btn_1PQ7r4Kxd7UNSlf8ykAVr0mB"
            publishable-key="pk_live_51PP1NjKxd7UNSlf8BiD3GK13Oxee0VEa9CqCI4r5Wn3hJPRVq3OCnRNlW5eIw7vyatATTjmcsRF1tVP9LsGQ8oPp00CZSyIXg2"
          ></stripe-buy-button>
        </div>
        <div className="plan">
          <h3>Pro Plan</h3>
          <p>Monitor up to 15 services.</p>
          <p>$10/month</p>
          <stripe-buy-button
            buy-button-id="buy_btn_1PQ7r4Kxd7UNSlf8ykAVr0mB"
            publishable-key="pk_live_51PP1NjKxd7UNSlf8BiD3GK13Oxee0VEa9CqCI4r5Wn3hJPRVq3OCnRNlW5eIw7vyatATTjmcsRF1tVP9LsGQ8oPp00CZSyIXg2"
          ></stripe-buy-button>
        </div>
        <div className="plan">
          <h3>Enterprise Plan</h3>
          <p>Monitor up to 50 services.</p>
          <p>$25/month</p>
          <stripe-buy-button
            buy-button-id="buy_btn_1PQ7r4Kxd7UNSlf8ykAVr0mB"
            publishable-key="pk_live_51PP1NjKxd7UNSlf8BiD3GK13Oxee0VEa9CqCI4r5Wn3hJPRVq3OCnRNlW5eIw7vyatATTjmcsRF1tVP9LsGQ8oPp00CZSyIXg2"
          ></stripe-buy-button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlan;
