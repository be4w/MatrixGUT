#!/usr/bin/env node

/**
 * Quick API Test Script
 * Tests the Vercel API routes locally
 */

const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function testAPI() {
    console.log('🧪 Testing MatrixGUT API Routes\n');
    console.log(`Base URL: ${API_BASE}\n`);

    try {
        // Test 1: GET /api/tasks
        console.log('1️⃣ Testing GET /api/tasks...');
        const getResponse = await fetch(`${API_BASE}/api/tasks`);
        if (!getResponse.ok) {
            throw new Error(`GET failed: ${getResponse.status} ${getResponse.statusText}`);
        }
        const tasks = await getResponse.json();
        console.log(`✅ GET /api/tasks returned ${tasks.length} tasks\n`);

        // Test 2: POST /api/tasks
        console.log('2️⃣ Testing POST /api/tasks...');
        const newTask = {
            name: 'Test Task ' + Date.now(),
            gravity: 5,
            urgency: 4,
            tendency: 3,
            labels: ['test'],
            notes: 'Created by API test script'
        };
        const postResponse = await fetch(`${API_BASE}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        if (!postResponse.ok) {
            const errorText = await postResponse.text();
            throw new Error(`POST failed: ${postResponse.status} - ${errorText}`);
        }
        const createdTask = await postResponse.json();
        console.log(`✅ POST /api/tasks created task with ID: ${createdTask.id}\n`);

        // Test 3: PATCH /api/tasks/:id
        console.log(`3️⃣ Testing PATCH /api/tasks/${createdTask.id}...`);
        const patchResponse = await fetch(`${API_BASE}/api/tasks/${createdTask.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
        });
        if (!patchResponse.ok) {
            const errorText = await patchResponse.text();
            throw new Error(`PATCH failed: ${patchResponse.status} - ${errorText}`);
        }
        const updatedTask = await patchResponse.json();
        console.log(`✅ PATCH /api/tasks/${createdTask.id} marked as completed: ${updatedTask.completed}\n`);

        // Test 4: DELETE /api/tasks/:id (THE CRITICAL TEST!)
        console.log(`4️⃣ Testing DELETE /api/tasks/${createdTask.id}... (CRITICAL TEST)`);
        const deleteResponse = await fetch(`${API_BASE}/api/tasks/${createdTask.id}`, {
            method: 'DELETE'
        });
        if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text();
            throw new Error(`DELETE failed: ${deleteResponse.status} - ${errorText}`);
        }
        console.log(`✅ DELETE /api/tasks/${createdTask.id} succeeded (status: ${deleteResponse.status})\n`);

        // Test 5: Verify deletion
        console.log('5️⃣ Verifying task was deleted...');
        const verifyResponse = await fetch(`${API_BASE}/api/tasks`);
        const tasksAfterDelete = await verifyResponse.json();
        const taskStillExists = tasksAfterDelete.find(t => t.id === createdTask.id);
        if (taskStillExists) {
            throw new Error('Task still exists after deletion!');
        }
        console.log(`✅ Task ${createdTask.id} successfully deleted and verified\n`);

        console.log('🎉 ALL TESTS PASSED! 🎉');
        console.log('\n✅ API Routes Status:');
        console.log('  GET    /api/tasks     ✓');
        console.log('  POST   /api/tasks     ✓');
        console.log('  PATCH  /api/tasks/:id ✓');
        console.log('  DELETE /api/tasks/:id ✓ (FIXED!)');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    }
}

// Run tests
testAPI();
