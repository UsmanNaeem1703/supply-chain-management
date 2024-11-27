// src/components/Graph.js
import React, { useEffect } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

function Graph({ transactions }) {
    useEffect(() => {
        const nodes = new DataSet();
        const edges = new DataSet();
        const edgeAggregates = {};

        transactions.forEach(tx => {
            const fromNodeId = tx.fromNode._id;
            const toNodeId = tx.toNode._id;
            const fromNodeLabel = tx.fromNode.name + ' ' + (tx.fromNode.stock || '');
            const toNodeLabel = tx.toNode.name;

            // Adding nodes with unique stock information if provided
            if (!nodes.get(fromNodeId)) {
                nodes.add({
                    id: fromNodeId,
                    label: fromNodeLabel,
                    title: 'Node: ' + tx.fromNode.name
                });
            }
            if (!nodes.get(toNodeId)) {
                nodes.add({
                    id: toNodeId,
                    label: toNodeLabel,
                    title: 'Node: ' + tx.toNode.name
                });
            }

            // Edge key for identifying unique transactions
            const key = fromNodeId + '-' + toNodeId;

            // Aggregate transactions for simplicity in visualization
            if (!edgeAggregates[key]) {
                edgeAggregates[key] = {
                    from: fromNodeId,
                    to: toNodeId,
                    quantity: 0
                };
            }
            edgeAggregates[key].quantity += tx.quantity;
        });

        // Adding edges with aggregated transactions
        Object.values(edgeAggregates).forEach(agg => {
            edges.add({
                from: agg.from,
                to: agg.to,
                label: `${agg.quantity} units`,
                title: `${agg.quantity} units transferred`
            });
        });

        const container = document.getElementById('mynetwork');
        const data = { nodes, edges };
        const options = {
            nodes: {
                shape: 'dot',
                size: 20,
                font: {
                    size: 16,
                    color: 'white'
                }
            },
            edges: {
                width: 2,
                arrows: 'to',
                font: {
                    size: 12,
                    align: 'middle'
                },
                smooth: {
                    type: 'curvedCW',
                    forceDirection: 'vertical',
                    roundness: 0.4
                }
            },
            layout: {
                hierarchical: {
                    enabled: false,
                    levelSeparation: 150,
                    nodeSpacing: 100,
                    treeSpacing: 200,
                    direction: 'UD',  // from top to bottom
                    sortMethod: 'directed'  // directed for showing directed edges
                }
            },
            physics: {
                enabled: false  // Disable physics for better control of node placement
            }
        };

        // Create the network graph
        new Network(container, data, options);
    }, [transactions]); // Ensure effect runs on transaction change

    return <div id="mynetwork" style={{ height: '500px', width: '100%' }} />;
}

export default Graph;
