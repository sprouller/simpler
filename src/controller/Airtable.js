import Airtable from "airtable";

var base = new Airtable({ apiKey: process.env.REACT_APP_API_KEY }).base(
  "app4MuI5YyGmbvfrP"
);

export async function fetchSprints() {
  const sprintsTableId = process.env.REACT_APP_SPRINTS_TABLE_ID;
  const sprints = await base(sprintsTableId)
    .select({
      view: "Grid view",
    })
    .all();
  return sprints?.map((sprint) => {
    let s = sprint.get("start_date");
    let ds = new Date(s);
    let e = sprint.get("end_date");
    let de = new Date(e);
    console.log(`UTC ${de}`);

    let sprintObj = {
      allDay: true,
      id: sprint.get("id"),
      start: ds.toUTCString(),
      end: de.toUTCString(),
      title: "Default Title",
      employee: {
        id: sprint.get("Employees") !== undefined && sprint.get("Employees")[0],
        firstName:
          sprint.get("first_name (from Employees)") &&
          sprint.get("first_name (from Employees)")[0],
        surname:
          sprint.get("surname (from Employees)") &&
          sprint.get("surname (from Employees)")[0],
        colour:
          sprint.get("colour (from Employees)") &&
          sprint.get("colour (from Employees)")[0],
      },
      job: {
        id: sprint.get("Jobs")[0],
        name:
          sprint.get("job_name (from Jobs)") !== undefined
            ? sprint.get("job_name (from Jobs)")[0]
            : "",
        timeAllocated: sprint.get("time_allocated (from Jobs)")[0],
        client: {
          id: sprint.get("Clients (from Jobs)")[0],
          name: sprint.get("name (from Clients) (from Jobs)")[0],
        },
        job_code:
          sprint.get("job_code (from Jobs)") !== undefined
            ? sprint.get("job_code (from Jobs)")[0]
            : "",
        description:
          sprint.get("description (from Jobs)") !== undefined &&
          sprint.get("description (from Jobs)")[0],
        subBrand:
          sprint.get("subBrand (from Jobs)") !== undefined &&
          sprint.get("subBrand (from Jobs)")[0],
      },
      outofoffice:
        sprint.get("id") !== undefined ? sprint.get("outofoffice") : "",
    };
    sprintObj.title = `Client: ${sprintObj.job.client.name} | Job: ${sprintObj.job.name} | ${sprintObj.employee.firstName}`;
    return sprintObj;
  });
}

export async function fetchEmployees() {
  const employeesTableId = process.env.REACT_APP_EMPLOYEES_TABLE_ID;
  const employees = await base(employeesTableId).select().all();
  return employees.map((employee) => {
    return {
      id: employee.get("id"),
      firstName: employee.get("first_name"),
      surname: employee.get("surname"),
      colour: employee.get("colour"),
      description:
        employee?.get("description") !== undefined &&
        employee?.get("description"),
      title: employee?.get("title") !== undefined && employee?.get("title"),
      number: employee?.get("number") !== undefined && employee?.get("number"),
      startedDate:
        employee?.get("startedDate") !== undefined &&
        employee?.get("startedDate"),
      address:
        employee?.get("address") !== undefined && employee?.get("address"),
      dateOfBirth:
        employee?.get("dateOfBirth") !== undefined &&
        employee?.get("dateOfBirth"),
      holiday:
        employee?.get("holiday") !== undefined && employee?.get("holiday"),
    };
  });
}

export async function fetchClients() {
  const clientsTableId = process.env.REACT_APP_CLIENTS_TABLE_ID;
  const clients = await base(clientsTableId).select().all();
  return clients.map((client) => {
    return {
      id: client.get("id"),
      name: client.get("name"),
      subbrand: client.get("subbrand"),
      comp_logo: client.get("comp_logo"),
      client_type: client.get("client_type"),
      jobs: client.get("Jobs"),
      address: client.get("address"),
      description: client.get("description"),
    };
  });
}

export async function fetchCred() {
  const credTableId = process.env.REACT_APP_CREDENTIAL_TABLE_ID;
  const allCred = await base(credTableId).select().all();
  return allCred.map((client) => {
    console.log("airtble", client);
    return {
      id: client.get("id"),
      type: client.get("type"),
      email: client.get("email"),
      password: client.get("password"),
      clientDetails: client.get("clientDetails"),
    };
  });
}

export async function fetchJobs() {
  const jobTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  const allJobs = await base(jobTableId).select().all();
  return allJobs.map((job) => {
    return {
      id: job.get("id"),
      job_name: job.get("job_name") ? job.get("job_name") : "",
      time_allocated: job.get("time_allocated")
        ? job.get("time_allocated")
        : "",
      created_at: job.get("created_at") ? job.get("created_at") : "",
      status: job.get("status") ? job.get("status") : "",
      Clients: job.get("Clients") ? job.get("Clients") : "",
      job_code: job.get("job_code") ? job.get("job_code") : "",
      description: job.get("description") ? job.get("description") : "",
      subBrand: job.get("subBrand") ? job.get("subBrand") : "",
      Third_party_item: job.get("Third_party_item")
        ? job.get("Third_party_item")
        : "",
      Third_party_cost: job.get("Third_party_cost")
        ? job.get("Third_party_cost")
        : "",
    };
  });
}

export async function fetchOutOfOffice() {
  const credTableId = process.env.REACT_APP_OUTOFOFFICE_TABLE_ID;
  const allData = await base(credTableId).select().all();
  return allData.map((data) => {
    return {
      id: data.get("id"),
      employee: data.get("employee") !== undefined && data.get("employee"),
      start: data.get("start") !== undefined && data.get("start"),
      end: data.get("end") !== undefined && data.get("end"),
      item: data.get("item") !== undefined && data.get("item"),
      description:
        data.get("description") !== undefined && data.get("description"),
    };
  });
}

export async function fetchWorkItemsByJobId(jobId) {
  const workItemsTableId = process.env.REACT_APP_WORK_ITEMS_TABLE_ID;
  const workItems = await base(workItemsTableId)
    .select({
      filterByFormula: `{Jobs (from sprint)} = '${jobId}'`,
    })
    .all();
  console.log("Airtable");
  console.log({ workItems });
  return workItems.map((workItem) => {
    return {
      id: workItem.get("id"),
      dateOfWork: workItem.get("date_of_work"),
      hours: workItem.get("hours"),
      employee: {
        id: workItem.get("Employees (from sprint)")[0],
        firstName: workItem.get("first_name (from Employees) (from sprint)")[0],
        surname: workItem.get("surname (from Employees) (from sprint)")[0],
        colour: workItem.get("colour (from Employees) (from sprint)")[0],
      },
    };
  });
}

export async function addNewClient(clientDetails) {
  let { clientType, subClient, description, client, createdAt, compLogo } =
    clientDetails;
  console.log("Airtable", subClient);
  try {
    let returnedNewClient = await base(
      process.env.REACT_APP_CLIENTS_TABLE_ID
    ).create(
      {
        name: client,
        client_since: createdAt,
        subbrand: subClient,
        client_type: clientType,
        description: description,
        // comp_logo: compLogo,
      },
      { typecast: true }
    );
    console.log("airTable compLogo", compLogo);
    let clientId = returnedNewClient.getId();
    console.log(`Client ${clientId} added to Airtable`);
    return clientId;
  } catch (error) {
    console.log(error);
  }
}

export async function addNewEmployee(data, active, _id) {
  let { name, des, color, title, num, startedDate, address, dob, holiday } =
    data;
  try {
    if (_id?.length > 0) {
      const empTable = process.env.REACT_APP_EMPLOYEES_TABLE_ID;
      const fields = {
        first_name: name,
        surname: "patel",
        description: des,
        colour: color,
        title: title,
        number: num,
        startedDate,
        address,
        dateOfBirth: dob,
        holiday,
      };
      try {
        return await base(empTable).update(_id, fields);
      } catch (e) {
        console.log(e);
      }
    } else {
      if (active === true) {
        let returnedNewClient = await base(
          process.env.REACT_APP_EMPLOYEES_TABLE_ID
        ).create({
          first_name: name,
          surname: "patel",
          description: des,
          colour: color,
        });
        let clinetId = returnedNewClient.getId();
        console.log(`Client ${clinetId} added to Airtable`);
      } else {
        let returnedNewClient = await base(
          process.env.REACT_APP_EMPLOYEES_TABLE_ID
        ).create({
          first_name: name,
          surname: "patel",
          description: des,
          colour: color,
          title: title,
          number: num,
          startedDate,
          address,
          dateOfBirth: dob,
          holiday,
        });

        let clinetId = returnedNewClient.getId();
        console.log(`Client ${clinetId} added to Airtable`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addOutOfOfficeData(data) {
  let { employee, start, end, item, description } = data;
  try {
    let returnedRecord = await base(
      process.env.REACT_APP_OUTOFOFFICE_TABLE_ID
    ).create({
      employee,
      start,
      end,
      item,
      description,
    });
    let getId = returnedRecord.getId();
    return getId;
  } catch (e) {
    console.log(e);
  }
}

export async function addJobToAirtable(job) {
  let {
    jobName,
    clientId,
    timeAllocated,
    jobCode,
    description,
    subBrand,
    thirdPartyItem,
    thirdPartyCost,
  } = job;

  try {
    let returnedJobRecord = await base(
      process.env.REACT_APP_JOBS_TABLE_ID
    ).create({
      job_name: jobName,
      time_allocated: timeAllocated,
      status: "Closed",
      Clients: [clientId],
      job_code: jobCode,
      description: description,
      subBrand,
      Third_party_item: thirdPartyItem,
      Third_party_cost: thirdPartyCost,
    });
    let jobId = returnedJobRecord.getId();
    console.log(`created job ${jobId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function editClientToAirtable(cltData, _id) {
  let { clientType, subClient, description, client, createdAt, compLogo } =
    cltData;

  let cltDetails = {
    id: _id,
    fields: {
      name: client,
      client_since: createdAt,
      subbrand: subClient,
      client_type: clientType,
      description: description,
      // comp_logo: compLogo,
    },
  };
  const cltTableId = process.env.REACT_APP_CLIENTS_TABLE_ID;
  try {
    return await base(cltTableId).update(cltDetails.id, cltDetails.fields);
  } catch (error) {
    console.log({ error });
  }
}

export async function addJobAndSprintToAirtable(job, sprint) {
  let { jobName, clientId, timeAllocated, jobCode, description, subBrand } =
    job;
  let { employeeId, start, end } = sprint;
  console.log("sprints airtable", start, end);
  try {
    let returnedJobRecord = await base(
      process.env.REACT_APP_JOBS_TABLE_ID
    ).create({
      job_name: jobName,
      time_allocated: timeAllocated,
      status: "Closed",
      Clients: [clientId],
      job_code: jobCode,
      description: description,
      subBrand,
    });
    let jobId = returnedJobRecord.getId();
    console.log(`job ${jobId} added to Airtable. Adding sprint now...`);
    let returnedSprintRecord = await base(
      process.env.REACT_APP_SPRINTS_TABLE_ID
    ).create({
      start_date: start,
      end_date: end,
      Employees: [employeeId],
      Jobs: [jobId],
    });
    console.log(`sprint ${returnedSprintRecord.getId()} added to Airtable`);
  } catch (error) {
    console.log(error);
  }
}

export const addSprintToExistingJobInTable = async (sprintData, jobId) => {
  const { employeeId, start_date, end_date } = sprintData;
  try {
    let returnedSprintRecord = await base(
      process.env.REACT_APP_SPRINTS_TABLE_ID
    ).create({
      start_date,
      end_date,
      Employees: [employeeId],
      Jobs: [jobId],
    });
    console.log(`sprint ${returnedSprintRecord.getId()} added to Airtable`);
  } catch (error) {
    console.log(error);
  }
};

export const addWorkItemToAirtable = async (sprintId, date, hours) => {
  const workItemToAdd = {
    date_of_work: date,
    hours: hours,
    sprint: [sprintId],
  };
  try {
    let createdWorkItem = await base(
      process.env.REACT_APP_WORK_ITEMS_TABLE_ID
    ).create(workItemToAdd);
    console.log({ createdWorkItem });
    return createdWorkItem;
  } catch (error) {
    console.log({ error });
  }
};

export const editSprintInTable = async (sprintData) => {
  const { sprintId, start_date, end_date, employeeId } = sprintData;
  console.log("airtbale Sprint Date", start_date, end_date);
  const sprint = {
    id: sprintId,
    fields: {
      start_date: start_date,
      end_date: end_date,
      Employees: [employeeId],
    },
  };
  const sprintsTableId = process.env.REACT_APP_SPRINTS_TABLE_ID;
  try {
    return await base(sprintsTableId).update(sprint.id, sprint.fields);
  } catch (error) {
    console.log({ error });
  }
};

export const editJobInTable = async (jobData) => {
  const {
    jobId,
    jobName,
    clientId,
    timeAllocated,
    jobCode,
    description,
    subBrand,
    thirdPartyItem,
    thirdPartyCost,
  } = jobData;
  let job = {
    id: jobId,
    fields: {
      job_name: jobName,
      time_allocated: timeAllocated,
      status: "Closed",
      Clients: [clientId],
      job_code: jobCode,
      description: description,
      subBrand,
      Third_party_item: thirdPartyItem,
      Third_party_cost: thirdPartyCost,
    },
  };
  const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  try {
    return await base(jobsTableId).update(job.id, job.fields);
  } catch (error) {
    console.log({ error });
  }
};

export const editClient = async (cltData, _id) => {
  let { clientType, subClient, description, client, createdAt, compLogo } =
    cltData;

  const cltDetails = {
    id: _id,
    fields: {
      name: client,
      client_since: createdAt,
      subbrand: subClient,
      client_type: clientType,
      description: description,
      // comp_logo :compLogo
    },
  };

  const cltTableId = process.env.REACT_APP_CLIENTS_TABLE_ID;
  try {
    return await base(cltTableId).update(cltDetails.id, cltDetails.fields);
  } catch (error) {
    console.log({ error });
  }
};

export const deleteSprintFromTable = async (id) => {
  const sprintsTableId = process.env.REACT_APP_SPRINTS_TABLE_ID;
  try {
    return await base(sprintsTableId).destroy(id);
  } catch (error) {
    console.log({ error });
  }
};

export const deleteJobFromTable = async (id) => {
  const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  try {
    return await base(jobsTableId).destroy(id);
  } catch (error) {
    console.log({ error });
  }
};

export const deleteWorkItemFromTable = async (id) => {
  const workItemsTableId = process.env.REACT_APP_WORK_ITEMS_TABLE_ID;
  try {
    return await base(workItemsTableId).destroy(id);
  } catch (error) {
    console.log({ error });
  }
};
