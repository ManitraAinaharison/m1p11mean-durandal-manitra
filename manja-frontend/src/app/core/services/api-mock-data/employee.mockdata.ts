import { Employee } from '../../models/user.model';
import { subServiceMockData } from './service.mockdata';

const employeesData: Employee[] = [
  {
    firstname: 'Alice',
    lastname: 'Smith',
    email: 'alice.smith@company.com',
    username: 'asmith',
    password: 'P@ssw0rd1',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Bob',
    lastname: 'Johnson',
    email: 'bob.johnson@company.com',
    username: 'bjohnson',
    password: 'Secret123',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Carol',
    lastname: 'Brown',
    email: 'carol.brown@company.com',
    username: 'cbrown',
    password: 'SecurePass1',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'David',
    lastname: 'Lee',
    email: 'david.lee@company.com',
    username: 'dlee',
    password: 'MyP@ssw0rd!',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Eva',
    lastname: 'Garcia',
    email: 'eva.garcia@company.com',
    username: 'egarcia',
    password: 'Eva1234',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Frank',
    lastname: 'Rodriguez',
    email: 'frank.rodriguez@company.com',
    username: 'frodriguez',
    password: 'FrankPass',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Grace',
    lastname: 'Miller',
    email: 'grace.miller@company.com',
    username: 'gmiller',
    password: 'GracePass1',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Henry',
    lastname: 'Clark',
    email: 'henry.clark@company.com',
    username: 'hclark',
    password: 'Henry1234',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Isabel',
    lastname: 'Wright',
    email: 'isabel.wright@company.com',
    username: 'iwright',
    password: 'IsabelPass',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Jack',
    lastname: 'Baker',
    email: 'jack.baker@company.com',
    username: 'jbaker',
    password: 'Baker5678',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Karen',
    lastname: 'Turner',
    email: 'karen.turner@company.com',
    username: 'kturner',
    password: 'KarenPass',
    subServices: [],
    imgPath: 'img-path',
  },
  {
    firstname: 'Liam',
    lastname: 'Harris',
    email: 'liam.harris@company.com',
    username: 'lharris',
    password: 'Liam9876',
    subServices: [],
    imgPath: 'img-path',
  },
];

function assignSubServicesToEmployees(
  employeeList: Employee[],
  nbServicesPerEmployee: number = 3
): Employee[] {
  let count = 0;
  return employeeList.map((employee) => {
    employee.subServices.push(
      ...subServiceMockData.filter((_, index) => {
        const shouldAddToArray =
          index >= count && index < count + nbServicesPerEmployee;
        return shouldAddToArray;
      })
    );
    count++;
    return employee;
  });
}

export const employeesMockData = assignSubServicesToEmployees(employeesData);

export function findEmployee(query?: {
  filters?: {
    name?: string;
    serviceSlug?: string;
  };
  orderBy?: {
    field: 'favourites';
    order: 'ASC' | 'DESC';
  };
}): Employee[] {
  let result = employeesMockData;
  if (!query) return result;
  if (query.filters) {
    if (query.filters.name) {
      const name = query.filters.name;
      result = result.filter((employee) => employee.firstname.includes(name));
    }
    if (query.filters.serviceSlug) {
      const serviceSlug = query.filters.serviceSlug;
      result = result.filter((employee) =>
        employee.subServices.some(
          (subService) => subService.slug === serviceSlug
        )
      );
    }
  }
  if (query.orderBy) {
    if (query.orderBy.field === 'favourites') {
      // result.sort((employee1, employee2)=>{})
    }
    if (query.orderBy.order === 'ASC') {
    } else if (query.orderBy.order === 'DESC') {
      result.reverse();
    }
  }
  return result;
}
