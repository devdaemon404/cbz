import { HttpClient } from '../../utils/op-http-client';
import { isException } from '../../utils/op-exception';
import { OPToast, ToastVariant } from '../../utils/op-toast';

import {
  API_DATA_TYPE,
  API_DATA_TYPE_CALL,
  Datum,
  defaultAPIDATA,
} from 'src/types/response-types/client-admin/projects';

export class CAApiService {
  constructor(
    private httpClient: HttpClient,
    private clientId: string,
    private id: string,
  ) {}

  public setClientId(clientId: string) {
    this.clientId = clientId;
    console.log('Client ID is CAVM ', clientId);
  }
  public setId(id: string) {
    this.id = id;
    console.log('ID is CAVM', id);
  }

  // Fecth all Projects
  fetchAllProjects = async (): Promise<Datum[]> => {
    console.log('Client ID', this.clientId);
    const res = await this.httpClient.get<API_DATA_TYPE_CALL>(
      `project/client/${this.clientId}`,
    );
    if (isException(res)) {
      OPToast.show('Error fetching Project Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      // @ts-ignore
      return CAManageVendorsDefault.API_DATA;
    }
    return res.data;
  };

  // NEW  Projects
  addNewProject = async (data) => {
    console.log({ data });
    const res = await this.httpClient.post(
      `project/client/${this.clientId}`,
      data,
    );
    if (isException(res)) {
      OPToast.show(`${res.message}`, {
        variant: ToastVariant.ERROR,
      });
      // @ts-ignore
      return;
    } else {
      OPToast.show(`Project Added Successfully`, {
        variant: ToastVariant.SUCCESS,
      });
      return;
    }
  };

  // NEW  Projects
  updateProject = async (data, projectId) => {
    const res = await this.httpClient.patch(
      `project/${projectId}/PM?to_user_id=${data.project_manager_user_id}`,
      {},
    );
    console.log(data);
    if (isException(res)) {
      OPToast.show('Error updating project Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      // @ts-ignore
      return;
    }
    return;
  };

  // PM VC
  findPMVC = async () => {
    const res: any = await this.httpClient.get(
      `${this.clientId}/user/by/role?roles=PROJECT_MANAGER,VICE_PRESIDENT&show_all=true`,
    );
    console.log('RESULT OF PM VC', res);
    if (isException(res)) {
      OPToast.show('Error fetching Project Information', {
        variant: ToastVariant.ERROR,
        duration: 1000,
      });
      return null;
    }
    return res.data;
  };
}
