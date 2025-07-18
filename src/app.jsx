import React, { useState, useMemo } from 'react';
import { ChevronDown, BarChart3, Table, Filter, Plus, X, Move } from 'lucide-react';

const PivotTableBuilder = () => {
  // Sample sales data
  const salesData = [
    { region: 'North', category: 'Electronics', product: 'Laptop', quarter: 'Q1', sales: 15000, units: 50, cost: 12000 },
    { region: 'North', category: 'Electronics', product: 'Phone', quarter: 'Q1', sales: 8000, units: 80, cost: 6000 },
    { region: 'North', category: 'Clothing', product: 'Shirt', quarter: 'Q1', sales: 3000, units: 150, cost: 1500 },
    { region: 'North', category: 'Electronics', product: 'Laptop', quarter: 'Q2', sales: 18000, units: 60, cost: 14400 },
    { region: 'North', category: 'Electronics', product: 'Phone', quarter: 'Q2', sales: 9500, units: 95, cost: 7125 },
    { region: 'North', category: 'Clothing', product: 'Pants', quarter: 'Q2', sales: 4500, units: 90, cost: 2700 },
    { region: 'South', category: 'Electronics', product: 'Laptop', quarter: 'Q1', sales: 12000, units: 40, cost: 9600 },
    { region: 'South', category: 'Electronics', product: 'Tablet', quarter: 'Q1', sales: 6000, units: 60, cost: 4200 },
    { region: 'South', category: 'Clothing', product: 'Dress', quarter: 'Q1', sales: 5000, units: 100, cost: 2500 },
    { region: 'South', category: 'Electronics', product: 'Laptop', quarter: 'Q2', sales: 14000, units: 45, cost: 11200 },
    { region: 'South', category: 'Electronics', product: 'Phone', quarter: 'Q2', sales: 7500, units: 75, cost: 5625 },
    { region: 'South', category: 'Clothing', product: 'Shoes', quarter: 'Q2', sales: 6000, units: 120, cost: 3600 },
    { region: 'East', category: 'Electronics', product: 'Laptop', quarter: 'Q1', sales: 20000, units: 65, cost: 16000 },
    { region: 'East', category: 'Electronics', product: 'Phone', quarter: 'Q1', sales: 10000, units: 100, cost: 7500 },
    { region: 'East', category: 'Furniture', product: 'Chair', quarter: 'Q1', sales: 8000, units: 80, cost: 5600 },
    { region: 'East', category: 'Electronics', product: 'Tablet', quarter: 'Q2', sales: 7000, units: 70, cost: 4900 },
    { region: 'East', category: 'Furniture', product: 'Desk', quarter: 'Q2', sales: 12000, units: 40, cost: 8400 },
    { region: 'West', category: 'Electronics', product: 'Phone', quarter: 'Q1', sales: 9000, units: 90, cost: 6750 },
    { region: 'West', category: 'Furniture', product: 'Table', quarter: 'Q1', sales: 10000, units: 50, cost: 7000 },
    { region: 'West', category: 'Electronics', product: 'Laptop', quarter: 'Q2', sales: 16000, units: 55, cost: 12800 },
    { region: 'West', category: 'Furniture', product: 'Chair', quarter: 'Q2', sales: 9000, units: 90, cost: 6300 },
  ];

  const [rowFields, setRowFields] = useState(['region']);
  const [colFields, setColFields] = useState(['quarter']);
  const [measures, setMeasures] = useState([{ field: 'sales', aggregation: 'sum' }]);
  const [stratifyField, setStratifyField] = useState('');

  // Get unique field names
  const fields = Object.keys(salesData[0]);
  const dimensionFields = fields.filter(f => !['sales', 'units', 'cost'].includes(f));
  const measureFields = ['sales', 'units', 'cost'];
  const aggregationOptions = ['sum', 'average', 'count', 'min', 'max'];

  // Helper functions for managing fields
  const addRowField = () => {
    const availableFields = dimensionFields.filter(f => !rowFields.includes(f));
    if (availableFields.length > 0) {
      setRowFields([...rowFields, availableFields[0]]);
    }
  };

  const addColField = () => {
    const availableFields = dimensionFields.filter(f => !colFields.includes(f));
    if (availableFields.length > 0) {
      setColFields([...colFields, availableFields[0]]);
    }
  };

  const addMeasure = () => {
    const availableFields = measureFields.filter(f => !measures.map(m => m.field).includes(f));
    if (availableFields.length > 0) {
      setMeasures([...measures, { field: availableFields[0], aggregation: 'sum' }]);
    }
  };

  const updateRowField = (index, value) => {
    const newFields = [...rowFields];
    newFields[index] = value;
    setRowFields(newFields);
  };

  const updateColField = (index, value) => {
    const newFields = [...colFields];
    newFields[index] = value;
    setColFields(newFields);
  };

  const updateMeasure = (index, field, value) => {
    const newMeasures = [...measures];
    newMeasures[index] = { ...newMeasures[index], [field]: value };
    setMeasures(newMeasures);
  };

  const removeRowField = (index) => {
    if (rowFields.length > 1) {
      setRowFields(rowFields.filter((_, i) => i !== index));
    }
  };

  const removeColField = (index) => {
    if (colFields.length > 1) {
      setColFields(colFields.filter((_, i) => i !== index));
    }
  };

  const removeMeasure = (index) => {
    if (measures.length > 1) {
      setMeasures(measures.filter((_, i) => i !== index));
    }
  };

  // Generate pivot table data
  const pivotData = useMemo(() => {
    // Create hierarchical keys
    const createKey = (fields, row) => fields.map(f => row[f]).join('|');
    
    // Group data by row and column hierarchies
    const grouped = {};
    const rowValueSets = rowFields.map(() => new Set());
    const colValueSets = colFields.map(() => new Set());
    
    salesData.forEach(row => {
      const rowKey = createKey(rowFields, row);
      const colKey = createKey(colFields, row);
      const stratKey = stratifyField ? row[stratifyField] : null;
      
      // Track individual field values for headers
      rowFields.forEach((field, i) => rowValueSets[i].add(row[field]));
      colFields.forEach((field, i) => colValueSets[i].add(row[field]));
      
      if (!grouped[rowKey]) grouped[rowKey] = {};
      if (!grouped[rowKey][colKey]) grouped[rowKey][colKey] = {};
      
      if (stratifyField) {
        if (!grouped[rowKey][colKey][stratKey]) {
          grouped[rowKey][colKey][stratKey] = [];
        }
        grouped[rowKey][colKey][stratKey].push(row);
      } else {
        if (!grouped[rowKey][colKey].values) {
          grouped[rowKey][colKey].values = [];
        }
        grouped[rowKey][colKey].values.push(row);
      }
    });

    // Apply aggregations for each measure
    const aggregate = (values, measure) => {
      if (!values || values.length === 0) return 0;
      const nums = values.map(v => v[measure.field]);
      switch (measure.aggregation) {
        case 'sum': return nums.reduce((a, b) => a + b, 0);
        case 'average': return nums.reduce((a, b) => a + b, 0) / nums.length;
        case 'count': return nums.length;
        case 'min': return Math.min(...nums);
        case 'max': return Math.max(...nums);
        default: return 0;
      }
    };

    // Generate all possible combinations for rows and columns
    const generateCombinations = (valueSets) => {
      if (valueSets.length === 0) return [[]];
      if (valueSets.length === 1) return Array.from(valueSets[0]).map(v => [v]);
      
      const result = [];
      const first = Array.from(valueSets[0]);
      const restCombinations = generateCombinations(valueSets.slice(1));
      
      first.forEach(firstVal => {
        restCombinations.forEach(restComb => {
          result.push([firstVal, ...restComb]);
        });
      });
      
      return result;
    };

    const rowCombinations = generateCombinations(rowValueSets);
    const colCombinations = generateCombinations(colValueSets);

    // Build final pivot structure
    const result = {};
    rowCombinations.forEach(rowComb => {
      const rowKey = rowComb.join('|');
      result[rowKey] = {};
      colCombinations.forEach(colComb => {
        const colKey = colComb.join('|');
        if (stratifyField && grouped[rowKey] && grouped[rowKey][colKey]) {
          result[rowKey][colKey] = {};
          Object.keys(grouped[rowKey][colKey]).forEach(stratKey => {
            result[rowKey][colKey][stratKey] = {};
            measures.forEach(measure => {
              result[rowKey][colKey][stratKey][measure.field] = aggregate(grouped[rowKey][colKey][stratKey], measure);
            });
          });
        } else if (grouped[rowKey] && grouped[rowKey][colKey] && grouped[rowKey][colKey].values) {
          result[rowKey][colKey] = {};
          measures.forEach(measure => {
            result[rowKey][colKey][measure.field] = aggregate(grouped[rowKey][colKey].values, measure);
          });
        } else {
          result[rowKey][colKey] = {};
          measures.forEach(measure => {
            result[rowKey][colKey][measure.field] = stratifyField ? {} : 0;
          });
        }
      });
    });

    return { 
      data: result, 
      rowCombinations, 
      colCombinations,
      rowValueSets: rowValueSets.map(s => Array.from(s)),
      colValueSets: colValueSets.map(s => Array.from(s))
    };
  }, [rowFields, colFields, measures, stratifyField]);

  const formatValue = (value, measureField) => {
    if (typeof value === 'number') {
      if (measureField === 'sales' || measureField === 'cost') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      }
      const measure = measures.find(m => m.field === measureField);
      return measure?.aggregation === 'average' ? value.toFixed(2) : value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          Advanced Pivot Table Builder
        </h1>
        <p className="text-gray-600">Configure multiple dimensions and measures for complex data analysis</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
        <div className="space-y-6">
          {/* Row Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Row Fields
              </label>
              <button
                onClick={addRowField}
                disabled={rowFields.length >= dimensionFields.length}
                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {rowFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md p-2">
                  <span className="text-xs text-blue-600 font-medium">{index + 1}</span>
                  <select
                    value={field}
                    onChange={(e) => updateRowField(index, e.target.value)}
                    className="text-sm border-0 bg-transparent focus:ring-0 p-0"
                  >
                    {dimensionFields.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  {rowFields.length > 1 && (
                    <button
                      onClick={() => removeRowField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Table className="w-4 h-4" />
                Column Fields
              </label>
              <button
                onClick={addColField}
                disabled={colFields.length >= dimensionFields.length}
                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md p-2">
                  <span className="text-xs text-green-600 font-medium">{index + 1}</span>
                  <select
                    value={field}
                    onChange={(e) => updateColField(index, e.target.value)}
                    className="text-sm border-0 bg-transparent focus:ring-0 p-0"
                  >
                    {dimensionFields.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  {colFields.length > 1 && (
                    <button
                      onClick={() => removeColField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Measures */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Measures
              </label>
              <button
                onClick={addMeasure}
                disabled={measures.length >= measureFields.length}
                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {measures.map((measure, index) => (
                <div key={index} className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-md p-2">
                  <select
                    value={measure.field}
                    onChange={(e) => updateMeasure(index, 'field', e.target.value)}
                    className="text-sm border-0 bg-transparent focus:ring-0 p-0"
                  >
                    {measureFields.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <span className="text-xs text-purple-600">by</span>
                  <select
                    value={measure.aggregation}
                    onChange={(e) => updateMeasure(index, 'aggregation', e.target.value)}
                    className="text-sm border-0 bg-transparent focus:ring-0 p-0"
                  >
                    {aggregationOptions.map(agg => (
                      <option key={agg} value={agg}>{agg}</option>
                    ))}
                  </select>
                  {measures.length > 1 && (
                    <button
                      onClick={() => removeMeasure(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stratify Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stratify By
            </label>
            <div className="w-48">
              <select
                value={stratifyField}
                onChange={(e) => setStratifyField(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">None</option>
                {dimensionFields.filter(f => !rowFields.includes(f) && !colFields.includes(f)).map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {/* Row headers */}
                {rowFields.map((field, index) => (
                  <th key={field} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    {field}
                  </th>
                ))}
                {/* Column headers */}
                {pivotData.colCombinations.map((colComb, index) => (
                  <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <div className="space-y-1">
                      {colComb.map((value, i) => (
                        <div key={i} className="text-xs">
                          {colFields[i]}: {value}
                        </div>
                      ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pivotData.rowCombinations.map((rowComb, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {/* Row values */}
                  {rowComb.map((value, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-200">
                      {value}
                    </td>
                  ))}
                  {/* Data cells */}
                  {pivotData.colCombinations.map((colComb, colIndex) => {
                    const rowKey = rowComb.join('|');
                    const colKey = colComb.join('|');
                    const cellData = pivotData.data[rowKey][colKey];
                    
                    return (
                      <td key={colIndex} className="px-4 py-3 text-sm text-gray-900 text-center">
                        {stratifyField ? (
                          <div className="space-y-2">
                            {Object.entries(cellData).map(([stratKey, stratValues]) => (
                              <div key={stratKey} className="bg-gray-100 rounded px-2 py-1">
                                <div className="font-medium text-gray-600 text-xs mb-1">{stratKey}</div>
                                <div className="space-y-1">
                                  {measures.map(measure => (
                                    <div key={measure.field} className="text-xs">
                                      <span className="text-gray-500">{measure.field}:</span>
                                      <span className="ml-1 font-medium">
                                        {formatValue(stratValues[measure.field], measure.field)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {measures.map(measure => (
                              <div key={measure.field} className="text-xs">
                                <span className="text-gray-500">{measure.field}:</span>
                                <span className="ml-1 font-medium">
                                  {formatValue(cellData[measure.field], measure.field)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Table Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Row Dimensions:</span>
            <span className="ml-2 font-medium">{rowFields.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Column Dimensions:</span>
            <span className="ml-2 font-medium">{colFields.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Measures:</span>
            <span className="ml-2 font-medium">{measures.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Stratified:</span>
            <span className="ml-2 font-medium">{stratifyField || 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PivotTableBuilder;
