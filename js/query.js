export var all_info = `query getUserTalent {
    XP: transaction_aggregate(where:{type:{_eq:"xp"},event: {path: {_eq: "/dakar/div-01"}}}){
        aggregate{ 
          sum{
            amount
          }
        }
      }
         skills: transaction(
              order_by: {type: asc, createdAt: desc,amount:desc}
              where: {eventId: {_eq: 56}, _and: {type: {_like: "skill_%"}}}
            ) {
              type
              amount
            }
               AllProjectValidated:  xp_view(where: {event : {path: {_eq: "/dakar/div-01"}}}, order_by: {amount: desc}){
    path
    amount
  }
        event_user(where: { event: { path: { _eq: "/dakar/div-01" } } }, order_by: { user: { login: asc } }) {
            level
            user {
                login
                lastName
                firstName
                attrs
                totalUp
                totalDown
                auditRatio
                  groups {
                group {
                  members {
                    user {
                      login
                    }
                  }
                  object {
                    name
                  }
                  auditors(where:{grade: {_is_null: false}}) {
                    auditor {
                      login
                    }
                    grade
                  }
                }
              }
                
                projectsFinished: progresses_aggregate(distinct_on: [objectId], where: { event: { object: { id: { _eq: 100256 } }, _and: { campus: { _eq: "dakar" } } }, isDone: { _eq: true } }) {
                    aggregate {
                        count
                    }
                }
                projectsInProgress: progresses_aggregate(where: { _and: [{ path: { _ilike: "%/div-01/%" } }, { isDone: { _eq: false } }] }) {
                    aggregate {
                        count
                    }
                }
                lastProjectValidated: progresses(where: { grade: { _gt: 1 }, _and: { path: { _ilike: "%/div-01/%" } } }, order_by: { updatedAt: desc }, limit: 1) {
                    updatedAt
                    grade
                    object {
                        name
                    }
                }
               
                AllCheckpointDid: progresses_aggregate(where: { object: { name: { _eq: "Checkpoint" } }, grade: { _is_null: false } }) {
                    aggregate {
                        count
                    }
                }
                results(where: { object: { name: { _eq: "Checkpoint" } }, grade: { _is_null: false } }, order_by: { grade: desc }, limit: 1) {
                    grade
                }
            }
        }
    }`
    
    // export var Xp = `transaction_aggregate(where:{type:{_eq:"xp"},event: {path: {_eq: "/dakar/div-01"}}}){
    //     aggregate{ 
    //       sum{
    //         amount
    //       }
    //     }
    //   }`