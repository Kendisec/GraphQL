import { login, logout } from "./login.js";
import { graphql_url, Authentication_url, formatByteSize, DisplayUpandDown } from "./utils.js";
import { all_info } from "./query.js";
export function renderLoginForm() {
  document.body.innerHTML = `
      <div id="login_page" style="display: flex; justify-content: center;align-items: center;height: 100vh;">
        <form id="formulaire" class="form" onsubmit="handleFormSubmission(event)">
          <p class="form-title">Sign in to your account</p>
          <div class="input-container">
            <input placeholder="Enter email" id="email">
            <span>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
              </svg>
            </span>
          </div>
          <div class="input-container">
            <input placeholder="Enter password" id="mdp" type="password">
            <div id="error_messages"></div>
            <span>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
                </path>
                <path
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
              </svg>
            </span>
          </div>
          <button class="submit" id="submit" type="submit">
            Sign in
          </button>
        </form>
      </div>
    `;
  document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault()
    login(e)
  })
}

export function renderHomePage() {
  // const app = document.getElementById('app');
  document.body.innerHTML = `
      <div id="Home_Page">
        <div class="div-container">
          <div class="header">
          <div class="Graph"><span>GRAPHQL</span></div>
            <img src="/css/avatar.png" id="avatar" alt="" style="height: 40px; width: 40px;">
            <p id="Gitea"></p>
            <i class="fa fa-sign-out" id="logout" style="font-size:36px; position:absolute; right: 4px"></i>
          </div>
          <!--Container of the top field-->
          <div class="top-container">
          </div>
          <!--Container of the bottom field-->
          <div class="bottom-container">
            <div class="bottom-left" style="border: solid 1px;">
            <div class="ruban left"><span>AUDIT RATIO</span></div>
                <div id="chart"></div>
            </div>
            <div class="bottom-right" style="border: solid 1px;">
            <div class="ruban right"><span>TOP 10 PROJECTS</span></div>
              <svg id="myChart" width="600" height="400"></svg>
            </div>
          </div> 
        </div>
        <div id="popup"></div>
      </div>
    `;
  useFetchedData()
}



export async function useFetchedData() {
  const data = localStorage.getItem("authToken")
  if (data) {
    fetch(graphql_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data}`
      },
      body: JSON.stringify({
        query: all_info
      })
    })
      .then(response => response.json())
      .then(res => {
        if (typeof res != "undefined") {
          var topcontain = document.querySelector(".top-container")
          const gitea = res.data.event_user[0].user.login
          var gitt = document.getElementById("Gitea")
          gitt.textContent = gitea
          const lvl = res.data.event_user[0].level
          const attributs = res.data.event_user[0].user.attrs
          const nbrProjectinprogress = res.data.event_user[0].user.projectsFinished.aggregate.count
          const lastproject = res.data.event_user[0].user.lastProjectValidated[0].object.name
          const Ratio = res.data.event_user[0].user.auditRatio.toFixed(1)
          const Xp = formatByteSize(res.data.XP.aggregate.sum.amount)
          // console.log(res.data.XP.aggregate.sum.amount);
          console.log("ù", res.data.AllProjectValidated[0].path, res.data.AllProjectValidated[0].amount)
          const All = res.data.AllProjectValidated
            .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
            .slice(0, 10)
            .map(project => ({
              ...project,
              path: project.path.replace('\/dakar\/div-01\/', '') // Remove "text" from name
            }));

          console.log("this is allof ", All);
          const skills = res.data.skills
          // skills.forEach(element => {

          // });
          var avatar = document.getElementById("avatar")
          console.log("skills", skills);
          topcontain.innerHTML = `
              <div style="position:relative; left:10px"><strong>Level: ${lvl}</strong></div>
              <div><strong>Ratio: ${Ratio}</strong></div>
              <div><strong>Xp: ${Xp}</strong></div>
              <div style="position:relative; left:10px"><strong>LastProject: ${lastproject}</strong></div>
              <div><strong>Number_Finished_Projects: ${nbrProjectinprogress}</strong></div>
              
            `
          console.log(res.data.event_user[0].user.totalUp, res.data.event_user[0].user.totalDown);
          DisplayUpandDown(res.data.event_user[0].user.totalUp, res.data.event_user[0].user.totalDown)
          DisplayProject(All)
          avatar.addEventListener("click", () => {
            var pup = document.getElementById("popup")
            var XX = document.createElement("p")
            XX.classList.add("close_popup")
            XX.textContent = "X"
            pup.appendChild(XX)
            var image = document.createElement("img")
            image.src = "/css/avatar.png"
            image.id = "avatar"
            image.style.height = "50px";
            image.style.width = "50px";
            pup.appendChild(image)
            pup.style.display = "flex"
            pup.style.flexDirection = "column"
            var pi0 = document.createElement("p")
            pi0.textContent = "fullName: " + attributs.firstName + " " + attributs.lastName
            pup.appendChild(pi0)

            var pi2 = document.createElement("p")
            pi2.textContent = "nationality: " + attributs.nationality1
            pup.appendChild(pi2)

            var pi = document.createElement("p")
            pi.textContent = "mail: " + attributs.email
            pup.appendChild(pi)

            var pi1 = document.createElement("p")
            pi1.textContent = "phone: " + attributs.phone
            pup.appendChild(pi1)

            var clpop = document.querySelector(".close_popup")
            clpop.addEventListener("click", () => {
              document.querySelector("#popup").style.display = "none"
              document.querySelector("#popup").innerHTML = ""
            })
          })
        }
        document.querySelector("#logout").addEventListener("click", () => {
          logout()
        })
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    document.body.innerHTML = ""
    renderLoginForm()
  }
}

launcher()

function launcher() {
  var session = localStorage.getItem("authToken")
  if (session) {
    renderHomePage()
  } else {
    renderLoginForm()
  }
}

function DisplayProject(projectData) {
  // Extract labels and amounts
  const labels = projectData.map(project => project.path);
  const amounts = projectData.map(project => project.amount);

  // Chart dimensions and margins
  const svgWidth = 600;
  const svgHeight = 400;
  const margin = { top: 20, right: 30, bottom: 70, left: 50 }; // Adjust bottom margin for rotated labels
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  // Create SVG element
  const svg = d3.select('#myChart')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Create a group element to contain the bars
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create scales
  const x = d3.scaleBand()
    .domain(labels)
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(amounts)])
    .nice()
    .range([height, 0]);

  // Create axes
  const xAxis = g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  xAxis.selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  const yAxis = g.append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(y));

  // Create bars
  g.selectAll('.bar')
    .data(projectData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.path))
    .attr('y', d => y(d.amount))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.amount));

  // Add labels
  g.selectAll('.label')
    .data(projectData)
    .enter().append('text')
    .attr('class', 'label')
    .attr('x', d => x(d.path) + x.bandwidth() / 2)
    .attr('y', d => y(d.amount) - 5)
    .attr('dy', '.75em')
    .text(d => d.amount);
}