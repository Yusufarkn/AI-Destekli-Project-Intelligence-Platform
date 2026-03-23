const fs = require('fs');

function generateSprintData(count) {
    const data = [];
    for (let i = 1; i <= count; i++) {
        const sprint_id = `SPR-${i.toString().padStart(3, '0')}`;
        const task_completion_rate = parseFloat(Math.random().toFixed(2));
        const bug_count = Math.floor(Math.random() * 21);
        const avg_task_time = parseFloat((Math.random() * 9 + 1).toFixed(2));
        const workload_index = parseFloat((Math.random() * 1.5).toFixed(2));

        // Logic for is_delayed:
        // completion < 0.6 veya bug_count > 15 veya workload > 1.2 ise 1
        const is_delayed = (task_completion_rate < 0.6 || bug_count > 15 || workload_index > 1.2) ? 1 : 0;

        data.push({
            sprint_id,
            task_completion_rate,
            bug_count,
            avg_task_time,
            workload_index,
            is_delayed
        });
    }
    return data;
}

const sprintCount = 200;
const sprintData = generateSprintData(sprintCount);

fs.writeFileSync('sprint_data.json', JSON.stringify(sprintData, null, 2), 'utf8');
console.log(`${sprintCount} adet sprint verisi başarıyla 'sprint_data.json' dosyasına yazıldı.`);
