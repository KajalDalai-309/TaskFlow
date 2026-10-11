const { Client } = require('pg');

async function checkDb() {
    const client = new Client({
        connectionString: "postgresql://postgres:123@localhost:5438/projecttracker"
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const projectRes = await client.query('SELECT id, name, "owner_id" as ownerId from "projects"');
        const projectsMap = {};
        console.log(`-- PROJECTS (${projectRes.rows.length}) --`);
        for (const p of projectRes.rows) {
            const membersRes = await client.query('SELECT "user_id" FROM "project_members" WHERE "project_id" = $1', [p.id]);
            const memberIds = membersRes.rows.map(m => m.user_id);
            console.log(`Project: ${p.name} (${p.id}) | Owner: ${p.ownerid} | Members: [${memberIds.join(', ')}]`);
            projectsMap[p.id] = p.name;
        }

        if (projectRes.rows.length > 0) {
            const firstProjId = projectRes.rows[0].id;
            console.log(`Assigning orphaned issues to project: ${projectRes.rows[0].name} (${firstProjId})`);
            const updateRes = await client.query('UPDATE "issues" SET "projectId" = $1 WHERE "projectId" NOT IN (SELECT id FROM "projects") OR "projectId" IS NULL', [firstProjId]);
            console.log(`Updated ${updateRes.rowCount} orphaned issues.`);
        }

        const allIssuesRes = await client.query('SELECT id, title, status, "projectId" FROM "issues"');
        console.log('-- ISSUES --');
        allIssuesRes.rows.forEach(i => {
            const projectName = projectsMap[i.projectId] || 'MISSING PROJECT';
            console.log(`Issue: ${i.title} [Status: ${i.status}, Project: ${projectName} (${i.projectId})]`);
        });
        console.log('Total Issues count:', allIssuesRes.rows.length);

    } catch (err) {
        console.error('Database error:', err);
    } finally {
        await client.end();
    }
}

checkDb();
