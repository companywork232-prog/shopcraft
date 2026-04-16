var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { H as Subscribable, J as shallowEqualObjects, K as hashKey, L as getDefaultState, M as notifyManager, N as useQueryClient, r as reactExports, O as noop, Q as shouldThrowError, T as useQuery, V as useActor, W as createActor } from "./index-BhbW23l5.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function useBackendActor() {
  return useActor(createActor);
}
function useListContacts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContacts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useGetContact(id) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["contact", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getContact(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 3e4
  });
}
function useCreateContact() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.createContact(
        args.name,
        args.email,
        args.phone,
        args.company,
        args.status,
        args.notes
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] })
  });
}
function useDeleteContact() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteContact(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] })
  });
}
function useListDeals() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDeals();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreateDeal() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDeal(
        args.title,
        args.value,
        args.stage,
        args.contactId,
        args.probability,
        args.closeDate,
        args.notes
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deals"] })
  });
}
function useDeleteDeal() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteDeal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deals"] })
  });
}
function useListActivities() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActivities();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreateActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.createActivity(
        args.activityType,
        args.description,
        args.contactId,
        args.dealId,
        args.dueDate
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] })
  });
}
function useCompleteActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeActivity(args.id, args.completedAt);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] })
  });
}
function useDeleteActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteActivity(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] })
  });
}
function useListProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProduct(
        args.name,
        args.sku,
        args.costPrice,
        args.sellingPrice,
        args.stockQuantity,
        args.reorderThreshold,
        args.category
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] })
  });
}
function useDeleteProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] })
  });
}
function useAdjustStock() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.adjustStock(args.id, args.delta);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["low-stock"] });
    }
  });
}
function useListPurchaseOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPurchaseOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreatePurchaseOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPurchaseOrder(
        args.vendor,
        args.lineItems,
        args.expectedDelivery
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-orders"] })
  });
}
function useUpdatePurchaseOrderStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePurchaseOrderStatus(args.id, args.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-orders"] })
  });
}
function useListInvoices() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInvoices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreateInvoice() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInvoice(
        args.contactId,
        args.dealId,
        args.lineItems,
        args.dueDate
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] })
  });
}
function useUpdateInvoiceStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInvoiceStatus(args.id, args.status, args.paidAt);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] })
  });
}
function useDeleteInvoice() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteInvoice(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] })
  });
}
function useGetFinancialSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFinancialSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useListUserRoles() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserRoles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useAssignRole() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignRole(args.userId, args.role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-roles"] })
  });
}
function useRemoveRole() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeRole(userId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-roles"] })
  });
}
function useBootstrapFirstAdmin() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.bootstrapFirstAdmin();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-role"] });
      qc.invalidateQueries({ queryKey: ["user-roles"] });
    }
  });
}
export {
  useBootstrapFirstAdmin as A,
  useListContacts as a,
  useListDeals as b,
  useListProducts as c,
  useListInvoices as d,
  useCreateContact as e,
  useDeleteContact as f,
  useGetContact as g,
  useListActivities as h,
  useCreateDeal as i,
  useDeleteDeal as j,
  useCreateActivity as k,
  useCompleteActivity as l,
  useDeleteActivity as m,
  useCreateProduct as n,
  useDeleteProduct as o,
  useAdjustStock as p,
  useListPurchaseOrders as q,
  useCreatePurchaseOrder as r,
  useUpdatePurchaseOrderStatus as s,
  useCreateInvoice as t,
  useGetFinancialSummary as u,
  useUpdateInvoiceStatus as v,
  useDeleteInvoice as w,
  useListUserRoles as x,
  useAssignRole as y,
  useRemoveRole as z
};
