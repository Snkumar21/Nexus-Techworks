import { useEffect, useState } from "react";
import "./CurrencySelector.css";

const currencies = [
    {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
    },
    {
        code: "INR",
        name: "Indian Rupee",
        symbol: "₹",
    },
    {
        code: "EUR",
        name: "Euro",
        symbol: "€",
    },
    {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
    },
    {
        code: "AED",
        name: "UAE Dirham",
        symbol: "د.إ",
    },
    {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$",
    },
    {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
    },
    {
        code: "SGD",
        name: "Singapore Dollar",
        symbol: "S$",
    },
];

const CurrencySelector = ({ currency, setCurrency }) => {
    return (
        <div className="currency-selector">
            <span className="currency-label">
                View prices in
            </span>

            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="currency-select"
                aria-label="Select currency"
            >

                {currencies.map((item) => (
                    <option
                        key={item.code}
                        value={item.code}
                    >
                        {item.symbol} {item.code}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default CurrencySelector;
export { currencies };