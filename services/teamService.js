const { db, admin } = require('../config/firebaseConfig');

class TeamService {
  async createTeam(teamData) {
    // Create team in 'teams' collection
    const docRef = await db.collection('teams').add({
      name: teamData.name,
      members: [],
      createdAt: new Date().toISOString()
    });
    const teamDoc = await docRef.get();
    return { id: teamDoc.id, ...teamDoc.data() };
  }

  async getAllTeams() {
    // 1. Get teams from 'teams' collection
    const teamsSnapshot = await db.collection('teams').get();
    const teamsFromTeamsCol = [];
    teamsSnapshot.forEach(doc => {
      teamsFromTeamsCol.push({ id: doc.id, ...doc.data() });
    });

    // 2. Get teams from 'users' collection (role='team') - eski veriler için
    const usersSnapshot = await db.collection('users').get();
    const allUsers = [];
    usersSnapshot.forEach(doc => {
      allUsers.push({ id: doc.id, ...doc.data() });
    });

    const teamsFromUsersCol = allUsers
      .filter(u => u.role === 'team')
      .map(tu => {
        // Bu ekibe ait olan geliştiricileri bul (users koleksiyonundan)
        const members = allUsers
          .filter(u => u.teamId === tu.id || u.teamId === tu.name)
          .map(u => u.name);
        return {
          id: tu.id,
          name: tu.name,
          members: members
        };
      });

    // 3. İkisini birleştir ve ID bazlı tekilleştir (teams koleksiyonu öncelikli)
    // Ama teams koleksiyonundaki takımın members'ına, eski users koleksiyonundaki members'ları da ekle!
    const uniqueTeamsMap = new Map();
    
    // Önce teams koleksiyonundakileri işle
    teamsFromTeamsCol.forEach(t => {
      // Bu takım için eski users koleksiyonundaki members'ları bul
      const oldMembers = allUsers
        .filter(u => u.teamId === t.id || u.teamId === t.name)
        .map(u => u.name);
      
      // Eski ve yeni members'ları birleştir ve tekilleştir
      const allMembers = [...new Set([...(t.members || []), ...oldMembers])];
      
      uniqueTeamsMap.set(t.id, { ...t, members: allMembers });
    });
    
    // Sonra users koleksiyonundakileri ekle ama zaten varsa üstüne yazma
    teamsFromUsersCol.forEach(t => {
      if (!uniqueTeamsMap.has(t.id)) {
        uniqueTeamsMap.set(t.id, t);
      }
    });

    return Array.from(uniqueTeamsMap.values());
  }

  async addMember(teamId, memberName) {
    // Check if team exists in 'teams' or 'users' collection
    let teamRef = db.collection('teams').doc(teamId);
    let teamDoc = await teamRef.get();
    
    if (!teamDoc.exists) {
      // Eğer teams koleksiyonunda yoksa, users koleksiyonunda role='team' olanı kontrol et
      const usersSnapshot = await db.collection('users').get();
      const userTeams = [];
      usersSnapshot.forEach(doc => {
        userTeams.push({ id: doc.id, ...doc.data() });
      });
      const userTeam = userTeams.find(u => u.id === teamId && u.role === 'team');
      
      if (userTeam) {
        // Eski takım users koleksiyonundaydı, onu yeni teams koleksiyonuna taşı ve eski members'ları da ekle
        const members = userTeams
          .filter(u => u.teamId === userTeam.id || u.teamId === userTeam.name)
          .map(u => u.name);
        
        teamRef = db.collection('teams').doc(teamId);
        await teamRef.set({
          name: userTeam.name,
          members: members,
          createdAt: userTeam.createdAt || new Date().toISOString()
        });
        teamDoc = await teamRef.get();
      } else {
        throw new Error('Ekip bulunamadı.');
      }
    }

    // Create user in 'users' collection
    const userDocRef = await db.collection('users').add({
      name: memberName,
      role: 'developer',
      teamId: teamId,
      createdAt: new Date().toISOString()
    });

    // Update team's members array
    await teamRef.update({
      members: admin.firestore.FieldValue.arrayUnion(memberName),
      updatedAt: new Date().toISOString()
    });

    return { teamId, memberName, userId: userDocRef.id };
  }
}

module.exports = new TeamService();